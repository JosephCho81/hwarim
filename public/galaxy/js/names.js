// 붙여넣은 이름 목록 ↔ 롯데 송장파일 운송장번호 조회. 순수 함수.
import { headerAndRows } from './sheet.js';

export const INVOICE_HEADERS = ['수하인명', '운송장번호'];

// 롯데 수하인명은 한 사람의 여러 박스에 "_1", "_2" 꼬리를 붙인다.
const compact = (s) => String(s || '').replace(/\s+/g, '');
export const normName = (s) => compact(s).replace(/_\d+$/, '');

// 엑셀 열 복사 시 붙는 마지막 줄바꿈 하나만 버리고, 빈 줄은 위치 유지를 위해 남긴다.
export function parseNames(text) {
  const lines = String(text || '').replace(/\r\n?/g, '\n').split('\n');
  if (lines.length && lines[lines.length - 1].trim() === '') lines.pop();
  return lines.map((l) => l.trim());
}

function add(map, key, invoice) {
  const list = map.get(key) || [];
  if (!list.includes(invoice)) list.push(invoice);
  map.set(key, list);
}

// rows → 이름별 운송장번호 목록(파일 위→아래 순서, 중복 제거)
// base: 꼬리 뗀 이름(여러 박스 합침), exact: 꼬리 포함 이름
export function invoiceIndex(rows) {
  const { cols, data } = headerAndRows(rows, INVOICE_HEADERS, '롯데 송장파일(3번)');
  const index = { base: new Map(), exact: new Map() };
  for (const { row } of data) {
    const name = compact(row[cols['수하인명']]);
    const invoice = String(row[cols['운송장번호']] ?? '').trim();
    if (!name || !/^\d+$/.test(invoice)) continue;
    add(index.base, normName(name), invoice);
    add(index.exact, name, invoice);
  }
  return index;
}

// 이름마다 맨 위 송장 하나. "홍길동_2"처럼 꼬리째 붙여넣으면 그 박스의 송장.
// others: 채택 안 된 송장 개수(여러 박스·동명이인 확인용)
export function lookup(names, index) {
  return names.map((name) => {
    const key = compact(name);
    const list = !key ? []
      : (key !== normName(key) && index.exact.get(key)) || index.base.get(normName(key)) || [];
    return { name, invoice: list[0] || '', others: Math.max(list.length - 1, 0) };
  });
}
