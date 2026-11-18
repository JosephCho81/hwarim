// 3번(송장 결과) ↔ 1번(주문) 매칭. 순수 함수.
import { headerAndRows, UserError } from './sheet.js';
import { pickAddress } from './address.js';

export const INVOICE_HEADERS = ['NO', '수하인명', '운송장번호', '상품명', '상품상세내용', '수하인기본주소'];

const SEP = '\u0001';
export const normName = (s) => String(s || '').replace(/\s+/g, '').replace(/_\d+$/, '');
export const matchKey = (name, product, option) =>
  [normName(name), String(product || '').trim(), String(option || '').trim()].join(SEP);

// 3번 rows → NO 오름차순 송장 행
export function parseInvoices(rows) {
  const { cols, data } = headerAndRows(rows, INVOICE_HEADERS, '송장파일(3번)');
  const list = data.map(({ row, line }) => {
    const get = (h) => String(row[cols[h]] ?? '').trim();
    const noText = get('NO');
    const no = Number(noText);
    if (!noText || !Number.isFinite(no)) throw new UserError(`송장파일 ${line}행: NO 값이 숫자가 아닙니다 (${noText})`);
    return {
      no, line,
      name: get('수하인명'),
      invoice: get('운송장번호'),
      product: get('상품명'),
      option: get('상품상세내용'),
      address: get('수하인기본주소'),
    };
  });
  return list.sort((a, b) => a.no - b.no || a.line - b.line);
}

// orders: toMatchRecords 결과, invoices: parseInvoices 결과
export function matchInvoices(orders, invoices) {
  const byKey = new Map();
  for (const o of orders) {
    const k = matchKey(o.name, o.product, o.option);
    if (!byKey.has(k)) byKey.set(k, []);
    byKey.get(k).push(o);
  }
  const groups = new Map(); // (상품주문번호, 통합배송지) → 그룹
  const groupOf = (o) => {
    const gk = o.orderNo + SEP + o.address;
    if (!groups.has(gk)) {
      groups.set(gk, { orderNo: o.orderNo, address: o.address, method: o.method,
        carrier: o.carrier, firstIdx: o.idx, rows: [], invoices: [] });
    }
    return groups.get(gk);
  };
  for (const o of orders) if (o.orderNo) groupOf(o).rows.push(o);

  const unmatched = [];
  const ambiguous = [];
  const manualHits = new Map(); // 수기 행 idx → 송장번호 목록

  for (const inv of invoices) {
    if (!/^\d+$/.test(inv.invoice)) { unmatched.push({ ...inv, reason: '운송장번호 없음/형식 오류' }); continue; }
    const cands = byKey.get(matchKey(inv.name, inv.product, inv.option)) || [];
    const real = cands.filter((o) => o.orderNo);
    if (!real.length) {
      if (!cands.length) { unmatched.push({ ...inv, reason: '1번에 일치하는 행 없음' }); continue; }
      for (const m of cands) {
        const list = manualHits.get(m.idx) || [];
        if (!list.includes(inv.invoice)) list.push(inv.invoice);
        manualHits.set(m.idx, list);
      }
      continue;
    }
    let chosen = real;
    const addrs = [...new Set(real.map((o) => o.address))];
    if (addrs.length > 1) {
      const best = pickAddress(inv.address, addrs);
      if (best == null) {
        ambiguous.push({ ...inv, candidates: real.map((o) => ({ orderNo: o.orderNo, address: o.address })) });
        continue;
      }
      chosen = real.filter((o) => o.address === best);
    }
    for (const o of chosen) {
      const g = groupOf(o);
      if (!g.invoices.includes(inv.invoice)) g.invoices.push(inv.invoice); // 처음 만난 송장이 맨 앞
    }
  }

  const all = [...groups.values()].sort((a, b) => a.firstIdx - b.firstIdx);
  const assigned = all.filter((g) => g.invoices.length);
  return {
    assigned: assigned.map((g) => ({ orderNo: g.orderNo, method: g.method, carrier: g.carrier,
      invoice: g.invoices[0], address: g.address, name: g.rows[0].name })),
    noInvoice: all.filter((g) => !g.invoices.length).flatMap((g) => g.rows),
    unmatched,
    multi: assigned.filter((g) => g.invoices.length > 1).map((g) => ({ orderNo: g.orderNo,
      name: g.rows[0].name, adopted: g.invoices[0], rejected: g.invoices.slice(1) })),
    ambiguous,
    manual: orders.filter((o) => !o.orderNo).map((o) => ({ ...o, invoices: manualHits.get(o.idx) || [] })),
  };
}
