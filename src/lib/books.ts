import { db } from './db';
import type { Book, Category } from '@/types';

export const getBooks = async (
  filter: { category?: Category | ''; q?: string } = {},
): Promise<Book[]> => {
  await new Promise((r) => setTimeout(r, 800));
  const q = (filter.q ?? '').trim().toLowerCase();
  return db.books.filter(
    (b) =>
      (!filter.category || b.category === filter.category) &&
      (!q || b.title.toLowerCase().includes(q)),
  );
};

export const getBook = async (id: number): Promise<Book | undefined> =>
  db.books.find((b) => b.id === id);
