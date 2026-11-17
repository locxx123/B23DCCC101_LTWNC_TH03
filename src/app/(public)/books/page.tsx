import Link from 'next/link';
import { getBooks } from '@/lib/books';
import { formatTime } from '@/lib/format';
import { CATEGORIES } from '@/data/books';
import type { Category } from '@/types';

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category = '', q = '' } = await searchParams;
  const valid = CATEGORIES.find((c) => c === category) as Category | undefined;
  const books = await getBooks({ category: valid, q });
  return (
    <main>
      <h1>Danh mục sách</h1>
      <form method="GET">
        <label htmlFor="q">Tìm sách</label>{' '}
        <input id="q" name="q" defaultValue={q} />{' '}
        <label htmlFor="category">Chuyên mục</label>{' '}
        <select id="category" name="category" defaultValue={valid ?? ''}>
          <option value="">Tất cả chuyên mục</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>{' '}
        <button type="submit">Lọc</button>
      </form>
      <p>Tìm thấy {books.length} sách</p>
      <p>Render lúc: {formatTime()}</p>
      {books.length === 0 ? (
        <p>Không tìm thấy sách nào</p>
      ) : (
        <table>
          <tbody>
            {books.map((b) => (
              <tr key={b.id}>
                <td><Link href={`/books/${b.id}`}>{b.title}</Link></td>
                <td>{b.author}</td>
                <td>Số bản: {b.copies}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
