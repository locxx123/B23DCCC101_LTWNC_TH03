import type { Metadata } from 'next';
import Link from 'next/link';
import { db } from '@/lib/db';
import { CATEGORIES } from '@/data/books';

export const metadata: Metadata = { title: 'Thư viện khoa CNTT PTIT' };

export default function HomePage() {
  return (
    <main>
      <h1>Thư viện khoa CNTT PTIT</h1>
      <p>{db.books.length} đầu sách · {CATEGORIES.length} chuyên mục</p>
      <Link href="/books">Xem danh mục sách</Link>
    </main>
  );
}
