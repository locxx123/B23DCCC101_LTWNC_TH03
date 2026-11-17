import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { generateBooks } from '@/data/books';
import type { LoanFormState } from '@/lib/loan-validate';
import LoanForm from './LoanForm';

const books = generateBooks(24);
const empty: LoanFormState = { errors: {}, values: {} };

describe('LoanForm', () => {
  it('hiện lỗi dưới đúng ô', () => {
    // action chạy khi submit; lỗi hiện sau khi gửi
    return (async () => {
      const action = vi.fn().mockResolvedValue({
        ...empty, errors: { reason: 'Lý do tối thiểu 10 ký tự' },
      });
      render(<LoanForm books={books} action={action} />);
      await userEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));
      expect(await screen.findByText('Lý do tối thiểu 10 ký tự')).toBeInTheDocument();
    })();
  });

  it('điền hợp lệ thì action được gọi 1 lần với FormData đúng', async () => {
    const action = vi.fn().mockResolvedValue(empty);
    render(<LoanForm books={books} action={action} />);
    await userEvent.selectOptions(screen.getByLabelText('Sách'), '2');
    await userEvent.type(screen.getByLabelText('Ngày lấy sách'), '2099-01-01');
    await userEvent.selectOptions(screen.getByLabelText('Thời hạn mượn'), '14');
    await userEvent.type(screen.getByLabelText('Lý do mượn'), 'Mượn để học môn mạng');
    await userEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));
    expect(action).toHaveBeenCalledTimes(1);
    const fd = action.mock.calls[0][1] as FormData;
    expect(fd.get('bookId')).toBe('2');
    expect(fd.get('term')).toBe('14');
    expect(fd.get('quantity')).toBe('1');
  });

  it('hiện thông báo và giữ lại lý do đã nhập khi hết bản', async () => {
    const action = vi.fn().mockResolvedValue({
      errors: {}, values: { reason: 'Lý do đã nhập rồi' },
      message: 'Sách đã hết bản vào ngày này',
    });
    render(<LoanForm books={books} action={action} />);
    await userEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu' }));
    expect(await screen.findByText('Sách đã hết bản vào ngày này')).toBeInTheDocument();
    expect(screen.getByLabelText('Lý do mượn')).toHaveValue('Lý do đã nhập rồi');
  });

  it('có defaultBookId thì ô Sách được chọn sẵn', () => {
    render(<LoanForm books={books} defaultBookId={6} action={vi.fn()} />);
    expect(screen.getByLabelText('Sách')).toHaveValue('6');
  });
});
