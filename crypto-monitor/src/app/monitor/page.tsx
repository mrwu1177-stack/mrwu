'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWebSocket } from '@/hooks/useWebSocket';
import * as api from '@/services/api';

export default function MonitorPage() {
  const [signals, setSignals] = useState<api.AnomalySignal[]>([]);
  const [fearGreed, setFearGreed] = useState<api.FearGreedData | null>(null);
  const [globalMarket, setGlobalMarket] = useState<api.GlobalMarketData | null>(null);
  const [marketData, setMarketData] = useState<api.MarketData[]>([]);
  
  const { connected, lastMessage } = useWebSocket({
    autoConnect: true,
    onMessage: (message) => {
      if (message.type === 'anomaly_signal') {
        setSignals(prev => [message.data, ...prev].slice(0, 50));
      } else if (message.type === 'fear_greed') {
        setFearGreed(message.data);
      } else if (message.type === 'market_data') {
        setMarketData(message.data.slice(0, 20));
      }
    }
  });

  // 初始加载数据
  useEffect(() => {
    async function loadData() {
      const [signalsData, fgData, globalData] = await Promise.all([
        api.fetchAnomalySignals(50),
        api.fetchFearGreed(),
        api.fetchGlobalMarket()
      ]);
      setSignals(signalsData);
      setFearGreed(fgData);
      setGlobalMarket(globalData);
    }
    loadData();
  }, []);

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1e9) return (num / 1e9).toFixed(decimals) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(decimals) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(decimals) + 'K';
    return num.toFixed(decimals);
  };

  const getSignalColor = (direction: string) => {
    return direction === 'up' ? 'text-green-500' : 'text-red-500';
  };

  const getFearGreedColor = (value: number) => {
    if (value <= 20) return 'bg-red-500';
    if (value <= 40) return 'bg-orange-500';
    if (value <= 60) return 'bg-yellow-500';
    if (value <= 80) return 'bg-green-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* 顶部导航栏 */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <span className="text-xl font-bold">C</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">Crypto Monitor</h1>
                <p className="text-xs text-gray-400">实时异动监控</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-gray-400">
                  {connected ? '已连接' : '未连接'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 顶部数据概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">总市值</p>
            <p className="text-2xl font-bold mt-1">
              ${globalMarket?.totalMarketCap ? formatNumber(globalMarket.totalMarketCap) : '-'}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">24H交易量</p>
            <p className="text-2xl font-bold mt-1">
              ${globalMarket?.totalVolume ? formatNumber(globalMarket.totalVolume) : '-'}
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">BTC占比</p>
            <p className="text-2xl font-bold mt-1">
              {globalMarket?.btcDominance ? globalMarket.btcDominance.toFixed(1) : '-'}%
            </p>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <p className="text-gray-400 text-sm">活跃币种</p>
            <p className="text-2xl font-bold mt-1">
              {globalMarket?.activeCryptos || '-'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：异动信号列表（占2列） */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  异动信号监控
                </h2>
              </div>
              <div className="divide-y divide-gray-800">
                {signals.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    暂无异动信号
                  </div>
                ) : (
                  signals.map((signal, index) => (
                    <div key={`${signal.symbol}-${index}`} className="px-6 py-4 hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            signal.direction === 'up' 
                              ? 'bg-green-500/10 text-green-500' 
                              : 'bg-red-500/10 text-red-500'
                          }`}>
                            {signal.signal_type}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-lg">{signal.symbol}</span>
                              <span className={`text-sm ${getSignalColor(signal.direction)}`}>
                                {signal.change24h > 0 ? '+' : ''}{signal.change24h.toFixed(2)}%
                              </span>
                            </div>
                            <div className="text-sm text-gray-400">
                              价格: ${formatNumber(signal.price)} | 成交量: ${formatNumber(signal.volume)}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">
                            {new Date(signal.detected_at * 1000).toLocaleTimeString('zh-CN')}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(signal.detected_at * 1000).toLocaleDateString('zh-CN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* 右侧：恐贪指数和其他信息 */}
          <div className="space-y-6">
            {/* 恐贪指数 */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">恐贪指数</h2>
              {fearGreed ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-5xl font-bold">{fearGreed.value}</span>
                    <span className="text-gray-400">{fearGreed.classification}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getFearGreedColor(fearGreed.value)}`}
                      style={{ width: `${fearGreed.value}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>极度恐慌</span>
                    <span>中性</span>
                    <span>极度贪婪</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400 py-8">
                  加载中...
                </div>
              )}
            </div>

            {/* WebSocket状态 */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
              <h2 className="text-lg font-semibold mb-4">系统状态</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">连接状态</span>
                  <span className={connected ? 'text-green-500' : 'text-red-500'}>
                    {connected ? '在线' : '离线'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">更新方式</span>
                  <span className="text-orange-500">WebSocket实时推送</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">信号数量</span>
                  <span className="text-white">{signals.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
