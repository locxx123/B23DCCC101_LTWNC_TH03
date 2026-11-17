import { expect, it } from 'vitest';
import { formatDate } from './format';

it('đổi ngày YYYY-MM-DD sang dd/mm/yyyy', () => {
  expect(formatDate('2026-12-02')).toBe('02/12/2026');
});
