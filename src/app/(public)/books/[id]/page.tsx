import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBook } from '@/lib/books';
import { formatTime } from '@/lib/format';

export const revalidate = 60;

export const generateStaticParams = () =>
  Array.from({ length: 12 }, (_, i) => ({ id: String(i + 1) }));

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  const book = await getBook(Number((await params).id));
  if (!book) return { title: 'Không tìm thấy sách' };
  return {
    title: `${book.title} – ${book.author}`,
    description: `Sách ${book.category}, thư viện có ${book.copies} bản`,
  };
};

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const book = await getBook(Number((await params).id));
  if (!book) notFound();
  return (
    <main>
      <h1>{book.title}</h1>
      <p>Tác giả: {book.author}</p>
      <p>Chuyên mục: {book.category}</p>
      <p>Số bản: {book.copies}</p>
      <p>Cập nhật lúc: {formatTime()}</p>
      <Link href={`/loans?book=${book.id}`}>Mượn sách này</Link>
    </main>
  );
}
