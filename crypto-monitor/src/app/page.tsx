'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* 顶部导航 */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xl font-bold">M</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">MrWu</h1>
                <p className="text-xs text-gray-400">加密货币分析平台</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            选择你的分析工具
          </h2>
          <p className="text-gray-400 text-lg">
            专业的加密货币分析和监控系统
          </p>
        </div>

        {/* 卡片选择区 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* HelloYan 卡片 */}
          <Link href="/helloyan">
            <div
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${hoveredCard === 'helloyan' 
                  ? 'border-purple-500 transform scale-105 shadow-2xl shadow-purple-500/20' 
                  : 'border-gray-700 hover:border-purple-500 hover:shadow-xl'}`}
              onMouseEnter={() => setHoveredCard('helloyan')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
                    ${hoveredCard === 'helloyan' ? 'bg-purple-500 text-white' : 'bg-purple-500/20 text-purple-400'}`}>
                    策略分析
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">HelloYan</h3>
                <p className="text-gray-400 mb-6">
                  智能加密货币策略分析系统，提供专业的技术分析、趋势预测和投资建议
                </p>

                <div className="flex items-center text-purple-400 font-medium">
                  <span>开始使用</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Crypto Monitor 卡片 */}
          <Link href="/monitor">
            <div
              className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer
                ${hoveredCard === 'monitor' 
                  ? 'border-emerald-500 transform scale-105 shadow-2xl shadow-emerald-500/20' 
                  : 'border-gray-700 hover:border-emerald-500 hover:shadow-xl'}`}
              onMouseEnter={() => setHoveredCard('monitor')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-green-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300
                    ${hoveredCard === 'monitor' ? 'bg-emerald-500 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    实时监控
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">Crypto Monitor</h3>
                <p className="text-gray-400 mb-6">
                  加密货币异动监控中心，实时监控价格异动、市场数据和恐贪指数
                </p>

                <div className="flex items-center text-emerald-400 font-medium">
                  <span>开始使用</span>
                  <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* 功能特点 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">实时数据</h4>
            <p className="text-gray-400 text-sm">WebSocket实时推送，毫秒级数据更新</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">智能分析</h4>
            <p className="text-gray-400 text-sm">AI驱动的异动检测和市场分析</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">移动适配</h4>
            <p className="text-gray-400 text-sm">完美支持手机、平板和桌面端</p>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 MrWu. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
