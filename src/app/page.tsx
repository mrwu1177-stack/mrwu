import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '加密货币异动监控中心',
  description: '实时监控加密货币价格异动、新闻资讯和市场数据',
};

export default function Home() {
  return (
    <iframe
      src="/helloyan.html"
      title="加密货币异动监控中心"
      className="w-full h-full border-0"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}
