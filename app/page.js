'use client'

import React, { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // 直接加载 index.html 的内容到页面
    fetch('/index.html')
      .then(response => response.text())
      .then(html => {
        // 提取 body 内容
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        const bodyContent = doc.body.innerHTML
        
        // 渲染到当前页面
        document.getElementById('app-content').innerHTML = bodyContent
        
        // 执行页面中的脚本
        const scripts = doc.querySelectorAll('script')
        scripts.forEach(script => {
          const newScript = document.createElement('script')
          newScript.textContent = script.textContent
          if (script.src) {
            newScript.src = script.src
          }
          document.body.appendChild(newScript)
        })
      })
  }, [])

  return (
    <div>
      {/* 加载中显示 */}
      <div id="app-content" style={{ minHeight: '100vh' }}>
        <div style={{ padding: '50px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>HelloYan - 智能加密货币策略分析系统</h1>
          <p style={{ color: '#888' }}>正在加载...</p>
        </div>
      </div>
    </div>
  )
}
