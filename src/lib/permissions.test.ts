import { describe, expect, it } from 'vitest';
import { can } from './permissions';

describe('can', () => {
  it('khách chỉ xem được sách', () => {
    expect(can(undefined, 'book:view')).toBe(true);
    expect(can(undefined, 'loan:create')).toBe(false);
  });
  it('student gửi được yêu cầu mượn nhưng không duyệt được', () => {
    expect(can('student', 'loan:create')).toBe(true);
    expect(can('student', 'loan:review')).toBe(false);
  });
  it('admin duyệt được nhưng không gửi yêu cầu mượn', () => {
    expect(can('admin', 'loan:review')).toBe(true);
    expect(can('admin', 'loan:create')).toBe(false);
  });
});
