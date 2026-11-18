// 매칭 결과 → 4번(네이버 발송처리 일괄업로드, .xls biff8). 순수 함수.
import { XLSX, stringSheet, stamp } from './sheet.js';

export const NAVER_HEADERS = ['상품주문번호', '배송방법', '택배사', '송장번호'];

export function naverRows(assigned) {
  return assigned.map((a) => [a.orderNo, a.method, a.carrier, a.invoice]);
}

export function buildNaverWorkbook(assigned) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, stringSheet([NAVER_HEADERS, ...naverRows(assigned)]), '발송처리');
  return wb;
}

export function naverFile(assigned, now = new Date()) {
  const bytes = XLSX.write(buildNaverWorkbook(assigned), { bookType: 'biff8', type: 'array' });
  return { bytes, name: `발송처리_${stamp(now)}.xls` };
}
