export const metadata = {
  title: 'HelloYan - 智能加密货币策略分析',
  description: '智能加密货币策略分析系统',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <head>
        <script src="https://cdn.tailwindcss.com" />
        <script src="https://unpkg.com/lightweight-charts@4.1.0/dist/lightweight-charts.standalone.production.js" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
