'use server';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { can } from '@/lib/permissions';
import { reviewLoan } from '@/lib/loans';

export async function reviewLoanAction(id: number, status: 'approved' | 'rejected') {
  const session = await auth();
  if (!can(session?.user?.role, 'loan:review')) throw new Error('Không có quyền');
  reviewLoan(id, status);
  revalidatePath('/admin');
}
