'use client';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function Header() {
  const { data: session } = useSession();
  const user = session?.user;
  return (
    <nav style={{ display: 'flex', gap: 12, padding: 12, borderBottom: '1px solid #ccc' }}>
      <Link href="/">Trang chủ</Link>
      <Link href="/books">Sách</Link>
      {user ? (
        <>
          <span>Xin chào, {user.name} ({user.role})</span>
          <Link href="/loans">Sách đã mượn</Link>
          {user.role === 'admin' && <Link href="/admin">Quản trị</Link>}
          <button onClick={() => signOut({ redirectTo: '/' })}>Đăng xuất</button>
        </>
      ) : (
        <Link href="/login">Đăng nhập</Link>
      )}
    </nav>
  );
}
