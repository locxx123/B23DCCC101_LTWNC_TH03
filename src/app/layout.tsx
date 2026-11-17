import type { Metadata } from 'next';
import Providers from './providers';
import Header from '@/components/Header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Thư viện khoa CNTT', template: '%s | Thư viện khoa' },
  description: 'Tra cứu và đăng ký mượn sách của thư viện khoa CNTT',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
