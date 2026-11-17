import { describe, expect, it } from 'vitest';
import { generateBooks } from '@/data/books';
import { toLoanData, toLoanInput, validateLoan } from './loan-validate';
import type { LoanInput } from './loan-validate';

const books = generateBooks(24);
const valid: LoanInput = {
  bookId: '2', pickupDate: '2099-01-01', term: '14',
  quantity: '1', reason: 'Mượn để học môn mạng',
};
const check = (patch: Partial<LoanInput>) => validateLoan({ ...valid, ...patch }, books);

describe('validateLoan', () => {
  it('dữ liệu hợp lệ trả object rỗng', () => {
    expect(check({})).toEqual({});
  });
  it('form trống báo đủ lỗi', () => {
    const e = validateLoan(toLoanInput({}), books);
    expect(Object.keys(e).sort()).toEqual(['bookId', 'pickupDate', 'quantity', 'reason', 'term']);
  });
  it('ngày lấy sách quá khứ bị từ chối', () => {
    expect(check({ pickupDate: '2000-01-01' }).pickupDate).toMatch(/quá khứ/);
  });
  it('lý do dưới 10 ký tự bị từ chối, khoảng trắng không tính', () => {
    expect(check({ reason: 'ngắn' }).reason).toBeDefined();
    expect(check({ reason: '            ' }).reason).toBeDefined();
  });
  it('số quyển vượt số bản của sách bị từ chối', () => {
    expect(check({ bookId: '1', quantity: '2' }).quantity).toMatch(/Vượt/);
  });
  it('số quyển không phải số nguyên dương bị từ chối', () => {
    for (const q of ['0', '-1', '1.5', 'abc', '']) {
      expect(check({ quantity: q }).quantity).toBeDefined();
    }
  });
  it('thời hạn không hợp lệ bị từ chối', () => {
    expect(check({ term: '10' }).term).toBeDefined();
  });
});

describe('toLoanData', () => {
  it('ép kiểu số từ chuỗi', () => {
    expect(toLoanData({ ...valid, reason: '  lý do dài đủ  ' })).toEqual({
      bookId: 2, pickupDate: '2099-01-01', term: 14, quantity: 1, reason: 'lý do dài đủ',
    });
  });
});
