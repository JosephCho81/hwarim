// 주문파일(1번) 암호 해독. 비밀번호는 항상 1234.
import { XLSX, UserError } from './sheet.js';

export const ORDER_PASSWORD = '1234';

const isZip = (u) => u[0] === 0x50 && u[1] === 0x4b;
const isCfb = (u) => u[0] === 0xd0 && u[1] === 0xcf && u[2] === 0x11 && u[3] === 0xe0;

function isEncryptedOoxml(u8) {
  try {
    const cfb = XLSX.CFB.read(u8, { type: 'array' });
    return !!XLSX.CFB.find(cfb, 'EncryptionInfo');
  } catch {
    return false;
  }
}

// 반환값: SheetJS가 읽을 수 있는 암호 없는 바이트(Uint8Array)
// XP: xlsx-populate (브라우저는 window.XlsxPopulate, Node 테스트는 npm 패키지)
export async function openOrderFile(buf, XP = globalThis.XlsxPopulate) {
  const u8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  if (!u8.length) throw new UserError('빈 파일입니다.');
  if (isZip(u8)) return u8; // 이미 암호가 풀린 xlsx
  if (!isCfb(u8)) throw new UserError('엑셀 파일(.xlsx)이 아닙니다.');
  if (!isEncryptedOoxml(u8)) return u8; // 암호 없는 구형 .xls
  if (!XP) throw new UserError('해독 라이브러리를 불러오지 못했습니다. 새로고침하세요.');
  let wb;
  try {
    wb = await XP.fromDataAsync(u8, { password: ORDER_PASSWORD });
  } catch {
    throw new UserError('비밀번호가 1234가 아닙니다');
  }
  return wb.outputAsync('uint8array');
}
