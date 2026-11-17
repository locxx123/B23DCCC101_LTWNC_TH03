import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { db } from '@/lib/db';
import { countByStatus } from '@/lib/loans';
import { formatDate } from '@/lib/format';
import { reviewLoanAction } from './actions';

export const metadata = { title: 'Quản trị', robots: { index: false } };

export default async function AdminPage() {
  const session = await auth();
  if (!can(session?.user?.role, 'loan:review')) redirect('/forbidden');
  const c = countByStatus();
  const pending = db.loans.filter((l) => l.status === 'pending');
  return (
    <main>
      <h1>Duyệt yêu cầu mượn</h1>
      <p>Chờ duyệt: {c.pending} | Đã duyệt: {c.approved} | Từ chối: {c.rejected}</p>
      <table>
        <tbody>
          {pending.map((l) => (
            <tr key={l.id}>
              <td>{db.books.find((b) => b.id === l.bookId)?.title}</td>
              <td>{formatDate(l.pickupDate)}</td>
              <td>{l.term} ngày</td>
              <td>{l.userEmail}</td>
              <td>
                <form action={reviewLoanAction.bind(null, l.id, 'approved')}>
                  <button>Duyệt</button>
                </form>
              </td>
              <td>
                <form action={reviewLoanAction.bind(null, l.id, 'rejected')}>
                  <button>Từ chối</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
