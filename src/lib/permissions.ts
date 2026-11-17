import type { Role } from '@/types';

export type Action =
  | 'book:view'
  | 'loan:create'
  | 'loan:view-own'
  | 'loan:view-all'
  | 'loan:review';

const MATRIX: Record<Role | 'guest', Action[]> = {
  guest: ['book:view'],
  student: ['book:view', 'loan:create', 'loan:view-own'],
  admin: ['book:view', 'loan:view-all', 'loan:review'],
};

export const can = (role: Role | undefined, action: Action): boolean =>
  MATRIX[role ?? 'guest'].includes(action);
