import { describe, expect, it } from 'vitest';
import { cancelLoan, listLoans, submitLoan } from './loans';

const sv01 = { email: 'sv01@ptit.edu.vn', role: 'student' as const };
const admin = { email: 'admin@ptit.edu.vn', role: 'admin' as const };

describe('listLoans', () => {
  it('sv01 có 27 yêu cầu chia 3 trang (10/10/7)', () => {
    expect([1, 2, 3].map((p) => listLoans(sv01, undefined, p).items.length)).toEqual([10, 10, 7]);
    expect(listLoans(sv01).total).toBe(27);
  });
  it('admin thấy tất cả 37 yêu cầu', () => {
    expect(listLoans(admin).total).toBe(37);
  });
  it('trang vượt giới hạn bị kẹp lại', () => {
    expect(listLoans(sv01, undefined, 99).page).toBe(3);
    expect(listLoans(sv01, undefined, -5).page).toBe(1);
  });
});

describe('submitLoan và cancelLoan', () => {
  it('trả hết bản với sách id 6 ngày 2026-12-02', () => {
    const r = submitLoan(sv01.email, {
      bookId: 6, pickupDate: '2026-12-02', term: 7, quantity: 1, reason: 'đủ dài để mượn',
    });
    expect(r).toEqual({ ok: false, message: 'Sách đã hết bản vào ngày này' });
  });
  it('tạo được rồi cancelLoan đúng 3 mã', () => {
    const r = submitLoan(sv01.email, {
      bookId: 3, pickupDate: '2030-01-01', term: 7, quantity: 1, reason: 'đủ dài để mượn',
    });
    if (!r.ok) throw new Error('phải tạo được');
    expect(cancelLoan('sv02@ptit.edu.vn', r.loan.id)).toBe('forbidden');
    expect(cancelLoan(sv01.email, r.loan.id)).toBe('ok');
    expect(cancelLoan(sv01.email, r.loan.id)).toBe('not-found');
  });
});
