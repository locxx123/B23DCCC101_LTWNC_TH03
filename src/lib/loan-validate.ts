import type { Book } from '@/types';

export interface LoanInput {
  bookId: string; pickupDate: string; term: string;
  quantity: string; reason: string;
}
export interface LoanData {
  bookId: number; pickupDate: string; term: 7 | 14 | 30;
  quantity: number; reason: string;
}
export type LoanErrors = Partial<Record<keyof LoanInput, string>>;
export interface LoanFormState {
  errors: LoanErrors;
  values: Partial<LoanInput>;
  message?: string;
  ok?: boolean;
}

export const today = (): string => new Date().toISOString().slice(0, 10);

const str = (v: unknown): string => (typeof v === 'string' ? v : '');

export const toLoanInput = (raw: FormData | Record<string, unknown>): LoanInput => {
  const get = (k: string): string =>
    raw instanceof FormData ? str(raw.get(k)) : str(raw[k]);
  return {
    bookId: get('bookId'), pickupDate: get('pickupDate'), term: get('term'),
    quantity: get('quantity'), reason: get('reason'),
  };
};

export const validateLoan = (input: LoanInput, books: Book[]): LoanErrors => {
  const errors: LoanErrors = {};
  const book = books.find((b) => b.id === Number(input.bookId));
  if (!input.bookId || !book) errors.bookId = 'Hãy chọn sách';

  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.pickupDate)) {
    errors.pickupDate = 'Hãy chọn ngày';
  } else if (input.pickupDate < today()) {
    errors.pickupDate = 'Ngày lấy sách không được ở quá khứ';
  }

  if (!['7', '14', '30'].includes(input.term)) errors.term = 'Hãy chọn thời hạn';

  const qty = Number(input.quantity);
  if (!/^\d+$/.test(input.quantity.trim()) || qty < 1) {
    errors.quantity = 'Số quyển phải từ 1 trở lên';
  } else if (book && qty > book.copies) {
    errors.quantity = `Vượt số bản của sách (${book.copies} bản)`;
  }

  if (input.reason.trim().length < 10) errors.reason = 'Lý do tối thiểu 10 ký tự';
  return errors;
};

// Chỉ gọi khi validateLoan không còn lỗi.
export const toLoanData = (input: LoanInput): LoanData => ({
  bookId: Number(input.bookId),
  pickupDate: input.pickupDate,
  term: Number(input.term) as 7 | 14 | 30,
  quantity: Number(input.quantity),
  reason: input.reason.trim(),
});
