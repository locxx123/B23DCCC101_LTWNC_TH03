import Link from 'next/link';
import { auth } from '@/auth';
import { db } from '@/lib/db';
import { can } from '@/lib/permissions';
import { listLoans, parseStatus } from '@/lib/loans';
import { STATUS_LABEL, TERM_LABEL, formatDate } from '@/lib/format';
import LoanForm from '@/components/LoanForm';
import { cancelLoanAction, createLoanAction } from './actions';

export const metadata = { title: 'Sách đã mượn', robots: { index: false } };

export default async function LoansPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string; book?: string }>;
}) {
  const sp = await searchParams;
  const session = await auth();
  const user = session!.user; // proxy đã chặn khách
  const status = parseStatus(sp.status);
  const { items, page, totalPages } = listLoans(
    { email: user.email!, role: user.role },
    status,
    Number(sp.page) || 1,
  );
  const href = (p: number) =>
    `/loans?status=${status ?? ''}&page=${p}`;
  const bookId = Number(sp.book);
  return (
    <main>
      <h1>Sách đã mượn</h1>

      {can(user.role, 'loan:create') && (
        <LoanForm
          books={db.books}
          defaultBookId={bookId > 0 ? bookId : undefined}
          action={createLoanAction}
        />
      )}

      <form method="GET">
        <label htmlFor="status">Trạng thái</label>{' '}
        <select id="status" name="status" defaultValue={status ?? ''}>
          <option value="">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="approved">Đã duyệt</option>
          <option value="rejected">Từ chối</option>
        </select>{' '}
        <button type="submit">Lọc</button>
      </form>

      <table>
        <tbody>
          {items.map((l) => (
            <tr key={l.id}>
              <td>{l.bookTitle}</td>
              <td>{formatDate(l.pickupDate)}</td>
              <td>{TERM_LABEL[l.term]}</td>
              <td>{l.quantity}</td>
              <td>{STATUS_LABEL[l.status]}</td>
              <td>
                {l.status === 'pending' && l.userEmail === user.email && (
                  <form action={cancelLoanAction.bind(null, l.id)}>
                    <button>Hủy</button>
                  </form>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>
        {page > 1 ? <Link href={href(page - 1)}>Trước</Link> : <span>Trước</span>}{' '}
        <span>Trang {page}/{totalPages}</span>{' '}
        {page < totalPages ? <Link href={href(page + 1)}>Sau</Link> : <span>Sau</span>}
      </p>
    </main>
  );
}
