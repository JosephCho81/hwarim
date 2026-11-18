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

// 첫 시트를 문자열 2차원 배열로 반환
export function firstSheetRows(wb) {
  const name = wb.SheetNames[0];
  const ws = name && wb.Sheets[name];
  if (!ws || !ws['!ref']) throw new UserError('첫 시트가 비어 있습니다.');
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

// 첫 행을 헤더로 보고, 완전히 빈 행을 뺀 데이터 행을 돌려준다(원래 행 번호 포함).
export function headerAndRows(rows, required, label) {
  if (!rows.length) throw new UserError(`${label}이(가) 비어 있습니다.`);
  const cols = findColumns(rows[0], required, label);
  const data = [];
  rows.slice(1).forEach((row, i) => {
    if (!isBlankRow(row)) data.push({ row, line: i + 2 });
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
