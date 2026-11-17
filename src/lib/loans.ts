import { db } from './db';
import { can } from './permissions';
import type { LoanData } from './loan-validate';
import type { Loan, LoanStatus, Role } from '@/types';

export interface Viewer { email: string; role: Role }
export type LoanRow = Loan & { bookTitle: string };

export const parseStatus = (v?: string): LoanStatus | undefined =>
  v === 'pending' || v === 'approved' || v === 'rejected' ? v : undefined;

const PAGE_SIZE = 10;

export const listLoans = (viewer: Viewer, status?: LoanStatus, page = 1) => {
  const all = can(viewer.role, 'loan:view-all');
  const filtered = db.loans.filter(
    (l) => (all || l.userEmail === viewer.email) && (!status || l.status === status),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const p = Math.min(Math.max(1, Math.floor(page) || 1), totalPages);
  const items: LoanRow[] = filtered
    .slice((p - 1) * PAGE_SIZE, p * PAGE_SIZE)
    .map((l) => ({
      ...l,
      bookTitle: db.books.find((b) => b.id === l.bookId)?.title ?? '',
    }));
  return { items, total: filtered.length, page: p, totalPages };
};

export const submitLoan = (
  email: string,
  data: LoanData,
): { ok: true; loan: Loan } | { ok: false; message: string } => {
  const book = db.books.find((b) => b.id === data.bookId);
  const taken = db.loans
    .filter(
      (l) =>
        l.bookId === data.bookId &&
        l.pickupDate === data.pickupDate &&
        l.status !== 'rejected',
    )
    .reduce((sum, l) => sum + l.quantity, 0);
  if (!book || taken + data.quantity > book.copies) {
    return { ok: false, message: 'Sách đã hết bản vào ngày này' };
  }
  const loan: Loan = {
    id: db.nextLoanId++,
    bookId: data.bookId,
    userEmail: email,
    pickupDate: data.pickupDate,
    term: data.term,
    quantity: data.quantity,
    reason: data.reason,
    status: 'pending',
  };
  db.loans.unshift(loan);
  return { ok: true, loan };
};

export const cancelLoan = (
  email: string,
  id: number,
): 'not-found' | 'forbidden' | 'not-pending' | 'ok' => {
  const idx = db.loans.findIndex((l) => l.id === id);
  if (idx < 0) return 'not-found';
  const loan = db.loans[idx];
  if (loan.userEmail !== email) return 'forbidden';
  if (loan.status !== 'pending') return 'not-pending';
  db.loans.splice(idx, 1);
  return 'ok';
};

export const reviewLoan = (id: number, status: 'approved' | 'rejected'): boolean => {
  const loan = db.loans.find((l) => l.id === id);
  if (!loan || loan.status !== 'pending') return false;
  loan.status = status;
  return true;
};

export const countByStatus = () => ({
  pending: db.loans.filter((l) => l.status === 'pending').length,
  approved: db.loans.filter((l) => l.status === 'approved').length,
  rejected: db.loans.filter((l) => l.status === 'rejected').length,
});
