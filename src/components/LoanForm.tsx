'use client';
import { useActionState } from 'react';
import { TERM_LABEL } from '@/lib/format';
import type { LoanFormState } from '@/lib/loan-validate';
import type { Book } from '@/types';

interface Props {
  books: Book[];
  defaultBookId?: number;
  action: (prev: LoanFormState, formData: FormData) => Promise<LoanFormState>;
}

const initial: LoanFormState = { errors: {}, values: {} };

export default function LoanForm({ books, defaultBookId, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initial);
  const v = state.values;
  const err = (msg?: string) => msg && <p role="alert">{msg}</p>;
  return (
    <form action={formAction} key={JSON.stringify(v)}>
      <p>
        <label htmlFor="bookId">Sách</label>{' '}
        <select
          id="bookId"
          name="bookId"
          defaultValue={v.bookId ?? (defaultBookId ? String(defaultBookId) : '')}
        >
          <option value="">-- Chọn sách --</option>
          {books.map((b) => (
            <option key={b.id} value={b.id}>{b.title} ({b.copies} bản)</option>
          ))}
        </select>
        {err(state.errors.bookId)}
      </p>
      <p>
        <label htmlFor="pickupDate">Ngày lấy sách</label>{' '}
        <input id="pickupDate" name="pickupDate" type="date" defaultValue={v.pickupDate ?? ''} />
        {err(state.errors.pickupDate)}
      </p>
      <p>
        <label htmlFor="term">Thời hạn mượn</label>{' '}
        <select id="term" name="term" defaultValue={v.term ?? ''}>
          <option value="">-- Chọn thời hạn --</option>
          {Object.entries(TERM_LABEL).map(([k, label]) => (
            <option key={k} value={k}>{label}</option>
          ))}
        </select>
        {err(state.errors.term)}
      </p>
      <p>
        <label htmlFor="quantity">Số quyển</label>{' '}
        <input id="quantity" name="quantity" type="number" defaultValue={v.quantity ?? '1'} />
        {err(state.errors.quantity)}
      </p>
      <p>
        <label htmlFor="reason">Lý do mượn</label>{' '}
        <textarea id="reason" name="reason" defaultValue={v.reason ?? ''} />
        {err(state.errors.reason)}
      </p>
      {state.message && <p role="alert">{state.message}</p>}
      <button disabled={pending}>Gửi yêu cầu</button>
    </form>
  );
}
