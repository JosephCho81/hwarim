// 1번(주문) → 2번(롯데택배 업로드). 순수 함수.
import { XLSX, UserError, headerAndRows, stringSheet, stamp } from './sheet.js';

export const ORDER_HEADERS = [
  '상품주문번호', '수취인명', '상품명', '옵션정보', '수량', '수취인연락처1',
  '통합배송지', '우편번호', '배송메세지', '배송방법', '택배사(주문 기준)',
];

export const LOTTE_HEADERS = [
  '받는사람', '상품명1', '상품상세1', '내품수량1', '전화번호1',
  '주소', '우편번호', '배송메시지', '수량(A타입)',
];

const ORDER_NO = /^\d+$/;

// 1번 첫 시트 rows → 주문 행 목록 (완전히 빈 행 제외, 수기 행 포함)
export function parseOrders(rows) {
  const { cols, data } = headerAndRows(rows, ORDER_HEADERS, '주문파일(1번)');
  const get = (row, h) => String(row[cols[h]] ?? '').trim();
  return data.map(({ row, line }, idx) => {
    const orderNo = get(row, '상품주문번호');
    if (orderNo && !ORDER_NO.test(orderNo)) {
      throw new UserError(`주문파일 ${line}행: 상품주문번호가 숫자가 아닙니다 (${orderNo})`);
    }
    return {
      idx,
      line,
      orderNo,
      name: get(row, '수취인명'),
      product: get(row, '상품명'),
      option: get(row, '옵션정보'),
      qty: get(row, '수량'),
      phone: get(row, '수취인연락처1'),
      address: get(row, '통합배송지'),
      zip: get(row, '우편번호'),
      message: get(row, '배송메세지'), // 앞뒤 공백만 제거, 내부 줄바꿈 유지
      method: get(row, '배송방법'),
      carrier: get(row, '택배사(주문 기준)'),
    };
  });
}

export function lotteRow(o) {
  return [o.name, o.product, o.option, o.qty, o.phone, o.address, o.zip, o.message, ''];
}

export function buildLotteWorkbook(orders) {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, stringSheet([LOTTE_HEADERS, ...orders.map(lotteRow)]), '1');
  XLSX.utils.book_append_sheet(wb, stringSheet([LOTTE_HEADERS]), '2');
  XLSX.utils.book_append_sheet(wb, stringSheet([LOTTE_HEADERS]), '3');
  return wb;
}

export function lotteFile(orders, now = new Date()) {
  const bytes = XLSX.write(buildLotteWorkbook(orders), { bookType: 'xlsx', type: 'array' });
  return { bytes, name: `롯데업로드_${stamp(now)}.xlsx` };
}

// localStorage에 보관할 매칭용 최소 항목
export function toMatchRecords(orders) {
  return orders.map((o) => ({
    idx: o.idx,
    orderNo: o.orderNo,
    name: o.name,
    product: o.product,
    option: o.option,
    address: o.address,
    method: o.method,
    carrier: o.carrier,
  }));
}
