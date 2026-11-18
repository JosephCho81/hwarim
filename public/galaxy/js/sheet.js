// 엑셀 읽기·쓰기 공통 도구. DOM 없음 → 브라우저·Node 공용.
import * as XLSX from '../vendor/xlsx.mjs';

export { XLSX };

export class UserError extends Error {}

const isGeneral = (z) => !z || z === 'General';

// raw:false 의 서식 문자열은 16자리 정수를 "2.02611E+15"로 망가뜨리므로,
// 일반 서식의 정수는 원래 숫자를 그대로 문자열로 만든다.
export function cellText(c) {
  if (!c || c.t === 'z' || c.t === 'e') return '';
  if (c.t === 's') return String(c.v ?? '');
  if (c.t === 'n' && isGeneral(c.z) && Number.isSafeInteger(c.v)) return String(c.v);
  if (c.w != null) return String(c.w);
  return c.v == null ? '' : String(c.v);
}

export function readWorkbook(data) {
  try {
    return XLSX.read(data, { type: 'array', cellNF: true, cellDates: false, dense: false });
  } catch (e) {
    if (/password/i.test(String(e && e.message))) throw new UserError('암호가 걸린 파일입니다.');
    throw new UserError('엑셀 파일을 읽을 수 없습니다. 파일 종류를 확인하세요.');
  }
}

// 시트를 문자열 2차원 배열로 반환
export function firstSheetRows(wb) {
  return sheetRows(wb, wb.SheetNames[0]);
}

// 필수 헤더가 모두 있는 첫 시트(없으면 첫 시트)
export function sheetRowsWith(wb, required) {
  for (const name of wb.SheetNames) {
    const rows = sheetRows(wb, name, true);
    if (rows && headerIndex(rows, required).missing.length === 0) return rows;
  }
  return firstSheetRows(wb);
}

function sheetRows(wb, name, quiet = false) {
  const ws = name && wb.Sheets[name];
  if (!ws || !ws['!ref']) {
    if (quiet) return null;
    throw new UserError('첫 시트가 비어 있습니다.');
  }
  const range = XLSX.utils.decode_range(ws['!ref']);
  const rows = [];
  for (let r = range.s.r; r <= range.e.r; r++) {
    const row = [];
    for (let c = range.s.c; c <= range.e.c; c++) {
      row.push(cellText(ws[XLSX.utils.encode_cell({ r, c })]));
    }
    rows.push(row);
  }
  return rows;
}

export const isBlankRow = (row) => row.every((v) => String(v).trim() === '');

// 헤더명으로 열 위치를 찾는다. 없으면 어떤 헤더가 없는지 알려 준다.
export function findColumns(header, required, label) {
  const names = header.map((h) => String(h).trim());
  const cols = {};
  const missing = [];
  for (const want of required) {
    const i = names.indexOf(want);
    if (i < 0) missing.push(want);
    else cols[want] = i;
  }
  if (missing.length) {
    throw new UserError(`${label}에 필수 헤더가 없습니다: ${missing.join(', ')}`);
  }
  return cols;
}

const HEADER_SCAN = 20;
const KNOWN = [
  ['받는사람', '롯데업로드 파일(2번)'],
  ['운송장번호', '롯데 송장파일(3번)'],
  ['송장번호', '네이버 발송처리 파일(4번)'],
];

// 위쪽 20행 중 필수 헤더가 가장 많이 있는 행을 헤더로 본다(제목 행이 있는 파일 대응).
function headerIndex(rows, required) {
  let best = { at: 0, missing: required };
  rows.slice(0, HEADER_SCAN).forEach((row, at) => {
    const names = row.map((h) => String(h).trim());
    const missing = required.filter((h) => !names.includes(h));
    if (missing.length < best.missing.length) best = { at, missing };
  });
  return best;
}

// label 자신의 번호(예: "(3번)")와 같은 파일 종류는 안내하지 않는다.
function wrongFileHint(rows, label) {
  const names = new Set(rows.slice(0, HEADER_SCAN).flat().map((h) => String(h).trim()));
  const self = (label.match(/\(\d번\)/) || [''])[0];
  const hit = KNOWN.find(([h, what]) => names.has(h) && !(self && what.includes(self)));
  return hit ? `\n올린 파일이 ${hit[1]}로 보입니다. 올바른 파일인지 확인하세요.` : '';
}

// 헤더 행 아래에서 완전히 빈 행을 뺀 데이터 행을 돌려준다(원래 행 번호 포함).
export function headerAndRows(rows, required, label) {
  if (!rows.length) throw new UserError(`${label}이(가) 비어 있습니다.`);
  const { at, missing } = headerIndex(rows, required);
  if (missing.length === required.length) {
    throw new UserError(`${label}에서 헤더 행을 찾지 못했습니다. 필요한 헤더: ${required.join(', ')}${wrongFileHint(rows, label)}`);
  }
  if (missing.length) {
    throw new UserError(`${label}에 필수 헤더가 없습니다: ${missing.join(', ')}${wrongFileHint(rows, label)}`);
  }
  const cols = findColumns(rows[at], required, label);
  const data = [];
  rows.slice(at + 1).forEach((row, i) => {
    if (!isBlankRow(row)) data.push({ row, line: at + i + 2 });
  });
  if (!data.length) throw new UserError(`${label}에 데이터 행이 없습니다.`);
  return { cols, data };
}

// 모든 셀을 문자열(t:'s')로 강제한 시트
export function stringSheet(aoa) {
  const ws = XLSX.utils.aoa_to_sheet(aoa.map((r) => r.map((v) => String(v ?? ''))));
  for (const k of Object.keys(ws)) {
    if (k[0] !== '!' && ws[k]) { ws[k].t = 's'; ws[k].v = String(ws[k].v ?? ''); }
  }
  return ws;
}

export function stamp(d = new Date()) {
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}_${p(d.getHours())}${p(d.getMinutes())}`;
}
