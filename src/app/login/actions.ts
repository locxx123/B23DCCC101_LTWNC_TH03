'use server';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

export async function loginAction(
  _prev: string | undefined,
  formData: FormData,
): Promise<string | undefined> {
  try {
    await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirectTo: String(formData.get('callbackUrl') || '/loans'),
    });
  } catch (error) {
    if (error instanceof AuthError) return 'Email hoặc mật khẩu không đúng';
    throw error; // redirect của Next.js cũng là exception, phải ném lại
  }
}
