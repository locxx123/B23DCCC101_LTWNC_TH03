'use client';
import { useActionState } from 'react';
import { loginAction } from './actions';

export default function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [error, action, pending] = useActionState(loginAction, undefined);
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <p><label htmlFor="email">Email</label> <input id="email" name="email" /></p>
      <p>
        <label htmlFor="password">Mật khẩu</label>{' '}
        <input id="password" name="password" type="password" />
      </p>
      {error && <p role="alert">{error}</p>}
      <button disabled={pending}>Đăng nhập</button>
    </form>
  );
}
