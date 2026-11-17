import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import LoginForm from './LoginForm';

export const metadata = { title: 'Đăng nhập' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  if (await auth()) redirect('/');
  const { callbackUrl = '/loans' } = await searchParams;
  return (
    <main>
      <h1>Đăng nhập</h1>
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
