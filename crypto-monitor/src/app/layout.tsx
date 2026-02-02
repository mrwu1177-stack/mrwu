import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MrWu - 加密货币分析平台',
  description: '专业的加密货币分析和监控系统',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
