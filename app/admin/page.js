'use client';

import { useState, useEffect } from 'react';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeySet, setApiKeySet] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 日志相关状态
  const [logs, setLogs] = useState([]);
  const [logFilter, setLogFilter] = useState('all');
  const [logsLoading, setLogsLoading] = useState(false);

  // 用户相关状态
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'user' });
  const [editingUserId, setEditingUserId] = useState(null);

  // 监控相关状态
  const [strategyData, setStrategyData] = useState(null);
  const [apiStatusData, setApiStatusData] = useState(null);
  const [dataStatusData, setDataStatusData] = useState(null);
  const [monitoringLoading, setMonitoringLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('logs');

  // 初始化
  useEffect(() => {
    const auth = localStorage.getItem('admin_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
      fetchConfig();
      fetchUsers();
    }
  }, []);

  // 自动刷新日志
  useEffect(() => {
    if (isAuthenticated) {
      fetchLogs();
      const interval = setInterval(fetchLogs, 5000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, logFilter]);

  // 自动刷新监控数据
  useEffect(() => {
    if (isAuthenticated) {
      fetchMonitoringData();
      const interval = setInterval(fetchMonitoringData, 30000); // 每30秒刷新
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const fetchConfig = async () => {
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setApiKeySet(data.config.newsApiKeySet);
      }
    } catch (error) {
      console.error('获取配置失败:', error);
    }
  };

  const fetchLogs = async () => {
    setLogsLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch(`/api/logs?limit=100&type=${logFilter}`, {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
      }
    } catch (error) {
      console.error('获取日志失败:', error);
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
    } finally {
      setUsersLoading(false);
    }
  };

  const fetchMonitoringData = async () => {
    setMonitoringLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');

      // 并行获取所有监控数据
      const [strategyRes, apiStatusRes, dataStatusRes] = await Promise.all([
        fetch('/api/monitoring/strategy', {
          headers: { 'Authorization': `Bearer ${auth}` }
        }),
        fetch('/api/monitoring/api-status', {
          headers: { 'Authorization': `Bearer ${auth}` }
        }),
        fetch('/api/monitoring/data-status', {
          headers: { 'Authorization': `Bearer ${auth}` }
        })
      ]);

      if (strategyRes.ok) {
        const data = await strategyRes.json();
        setStrategyData(data.data);
      }

      if (apiStatusRes.ok) {
        const data = await apiStatusRes.json();
        setApiStatusData(data.data);
      }

      if (dataStatusRes.ok) {
        const data = await dataStatusRes.json();
        setDataStatusData(data.data);
      }
    } catch (error) {
      console.error('获取监控数据失败:', error);
    } finally {
      setMonitoringLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/config', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      });

      if (response.ok) {
        setIsAuthenticated(true);
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_password', password);
        await fetchConfig();
        await fetchUsers();
        await fetchMonitoringData();
      } else if (response.status === 401) {
        setError('请输入密码');
      } else if (response.status === 403) {
        setError('密码错误');
      } else {
        setError('登录失败，请稍后重试');
      }
    } catch (error) {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth}`
        },
        body: JSON.stringify({
          newsApiKey: apiKey
        })
      });

      if (response.ok) {
        setMessageType('success');
        setMessage('API Key 已保存！');
        setApiKeySet(true);
        setApiKey('');
      } else {
        setMessageType('error');
        setMessage('保存失败，请稍后重试');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm('确定要清空所有日志吗？')) {
      return;
    }

    setLogsLoading(true);
    try {
      const auth = localStorage.getItem('admin_password');
      const response = await fetch('/api/logs', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth}`
        }
      });

      if (response.ok) {
        setLogs([]);
        alert('日志已清空');
      }
    } catch (error) {
      console.error('清空日志失败:', error);
      alert('清空日志失败');
    } finally {
      setLogsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_password');
    setPassword('');
    setApiKey('');
    setApiKeySet(false);
    setMessage('');
    setLogs([]);
    setUsers([]);
    setStrategyData(null);
    setApiStatusData(null);
    setDataStatusData(null);
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getLogIcon = (type) => {
    const icons = {
      info: 'ℹ️',
      success: '✅',
      warning: '⚠️',
      error: '❌'
    };
    return icons[type] || '📝';
  };

  const getLogColor = (type) => {
    const colors = {
      info: 'text-blue-400',
      success: 'text-green-400',
      warning: 'text-yellow-400',
      error: 'text-red-400'
    };
    return colors[type] || 'text-slate-400';
  };

  // 登录页面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HelloYan
              </span>
            </h1>
            <p className="text-slate-400">后台管理系统</p>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  管理密码
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入管理密码"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '登录中...' : '登录'}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <p className="text-xs text-slate-500 text-center">
                默认密码：helloyan2026
              </p>
              <p className="text-xs text-slate-600 text-center mt-1">
                请在 Railway 环境变量中设置 ADMIN_PASSWORD 更改密码
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 配置页面
  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                HelloYan
              </span>
            </h1>
            <p className="text-slate-400">后台管理系统</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all text-sm"
          >
            退出登录
          </button>
        </div>

        {/* 标签导航 */}
        <div className="mb-6 bg-slate-900 rounded-2xl p-2 border border-slate-800 inline-flex">
          {[
            { id: 'logs', label: '监控日志', icon: '📊' },
            { id: 'strategy', label: '策略分析', icon: '🎯' },
            { id: 'api', label: 'API状态', icon: '🔗' },
            { id: 'data', label: '数据监控', icon: '💾' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：配置和系统信息 */}
          <div className="space-y-6">
            {/* API Key 配置 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">API Key 配置</h2>
                {apiKeySet && (
                  <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full">
                    已配置
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveConfig} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Followin News API Key
                  </label>
                  <input
                    type="text"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={apiKeySet ? '留空保持当前配置' : '请输入 Followin News API Key'}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-mono text-sm"
                  />
                </div>

                {message && (
                  <div className={`p-3 rounded-lg ${
                    messageType === 'success'
                      ? 'bg-green-500/10 border border-green-500/20'
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}>
                    <p className={`text-sm ${
                      messageType === 'success' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {message}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? '保存中...' : '保存配置'}
                </button>
              </form>

              <div className="mt-4 pt-4 border-t border-slate-800">
                <a href="https://followin.io" target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:underline">
                  获取 API Key →
                </a>
              </div>
            </div>

            {/* 系统信息 */}
            <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6">系统信息</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">运行状态</span>
                  <span className="text-green-400 text-sm font-medium">正常</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">用户总数</span>
                  <span className="text-slate-300 text-sm font-medium">{users.length}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">日志总数</span>
                  <span className="text-slate-300 text-sm font-medium">{logs.length}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="text-slate-400 text-sm">API Key 状态</span>
                  <span className={apiKeySet ? 'text-green-400' : 'text-yellow-400' + ' text-sm font-medium'}>
                    {apiKeySet ? '已配置' : '未配置'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-400 text-sm">自动刷新</span>
                  <span className="text-blue-400 text-sm font-medium">5 秒</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：主要监控区域 */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'logs' && (
              /* 日志监控 */
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">监控日志</h2>

                  <div className="flex items-center gap-3">
                    {/* 过滤器 */}
                    <div className="flex gap-2">
                      {['all', 'info', 'success', 'warning', 'error'].map(type => (
                        <button
                          key={type}
                          onClick={() => setLogFilter(type)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            logFilter === type
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {type === 'all' ? '全部' : type}
                        </button>
                      ))}
                    </div>

                    {/* 清空按钮 */}
                    <button
                      onClick={handleClearLogs}
                      disabled={logsLoading}
                      className="px-3 py-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                    >
                      清空
                    </button>
                  </div>
                </div>

                {/* 日志列表 */}
                <div className="bg-slate-800/50 rounded-xl p-4 h-96 overflow-y-auto">
                  {logsLoading && logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      加载中...
                    </div>
                  ) : logs.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500">
                      暂无日志
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {logs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 p-3 bg-slate-800 rounded-lg text-sm"
                        >
                          <span className="text-lg">{getLogIcon(log.type)}</span>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium ${getLogColor(log.type)}`}>
                              {log.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatTime(log.timestamp)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                  <span>显示最近 {logs.length} 条日志</span>
                  <span>自动刷新: 每 5 秒</span>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              /* 策略分析监控 */
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">策略分析监控</h2>
                  {monitoringLoading && (
                    <span className="text-xs text-slate-500">刷新中...</span>
                  )}
                </div>

                <div className="space-y-6">
                  {/* 异动信号 */}
                  {strategyData?.signal && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">异动信号</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          strategyData.signal.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {strategyData.signal.status === 'active' ? '运行中' : '错误'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">数据点：</span>
                          <span className="text-white ml-2">{strategyData.signal.dataPoints}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">API延迟：</span>
                          <span className="text-white ml-2">{strategyData.signal.apiLatency}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400">数据源：</span>
                          <span className="text-white ml-2">{strategyData.signal.apiSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">更新时间：</span>
                          <span className="text-white ml-2">{formatTime(strategyData.signal.lastUpdate)}</span>
                        </div>
                      </div>
                      {strategyData.signal.error && (
                        <div className="mt-3 p-2 bg-red-500/10 rounded-lg text-xs text-red-400">
                          {strategyData.signal.error}
                        </div>
                      )}
                    </div>
                  )}

                  {/* 多币种策略 */}
                  {strategyData?.multicoin && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">多币种策略</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          strategyData.multicoin.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {strategyData.multicoin.status === 'active' ? '运行中' : '错误'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">策略数量：</span>
                          <span className="text-white ml-2">{strategyData.multicoin.dataPoints}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">API延迟：</span>
                          <span className="text-white ml-2">{strategyData.multicoin.apiLatency}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400">数据源：</span>
                          <span className="text-white ml-2">{strategyData.multicoin.apiSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">更新时间：</span>
                          <span className="text-white ml-2">{formatTime(strategyData.multicoin.lastUpdate)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 布林带分析 */}
                  {strategyData?.bollinger && (
                    <div className="bg-slate-800/50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">布林带分析</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          strategyData.bollinger.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {strategyData.bollinger.status === 'active' ? '运行中' : '错误'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">分析币种：</span>
                          <span className="text-white ml-2">{strategyData.bollinger.dataPoints}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">API延迟：</span>
                          <span className="text-white ml-2">{strategyData.bollinger.apiLatency}ms</span>
                        </div>
                        <div>
                          <span className="text-slate-400">数据源：</span>
                          <span className="text-white ml-2">{strategyData.bollinger.apiSource}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">更新时间：</span>
                          <span className="text-white ml-2">{formatTime(strategyData.bollinger.lastUpdate)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              /* API状态监控 */
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">API运行状态</h2>
                  {monitoringLoading && (
                    <span className="text-xs text-slate-500">刷新中...</span>
                  )}
                </div>

                {apiStatusData?.summary && (
                  <>
                    {/* 总体统计 */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-white">{apiStatusData.summary.total}</p>
                        <p className="text-xs text-slate-400 mt-1">总数</p>
                      </div>
                      <div className="bg-green-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-400">{apiStatusData.summary.healthy}</p>
                        <p className="text-xs text-slate-400 mt-1">正常</p>
                      </div>
                      <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-yellow-400">{apiStatusData.summary.degraded}</p>
                        <p className="text-xs text-slate-400 mt-1">降级</p>
                      </div>
                      <div className="bg-red-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-red-400">{apiStatusData.summary.down}</p>
                        <p className="text-xs text-slate-400 mt-1">故障</p>
                      </div>
                    </div>

                    {/* 健康度 */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">系统健康度</span>
                        <span className="text-lg font-bold text-white">{apiStatusData.summary.healthPercentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            parseFloat(apiStatusData.summary.healthPercentage) >= 80 ? 'bg-green-500' :
                            parseFloat(apiStatusData.summary.healthPercentage) >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: apiStatusData.summary.healthPercentage + '%' }}
                        />
                      </div>
                    </div>

                    {/* API列表 */}
                    <div className="space-y-4">
                      {Object.entries(apiStatusData.apis).map(([category, apis]) => (
                        <div key={category}>
                          <h4 className="text-sm font-semibold text-slate-300 mb-2">{category}</h4>
                          <div className="space-y-2">
                            {apis.map(api => (
                              <div key={api.id} className="bg-slate-800/50 rounded-lg p-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-white">{api.name}</p>
                                    <p className="text-xs text-slate-500">{api.url}</p>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                      api.status === 'healthy' ? 'bg-green-500/20 text-green-400' :
                                      api.status === 'degraded' ? 'bg-yellow-500/20 text-yellow-400' :
                                      'bg-red-500/20 text-red-400'
                                    }`}>
                                      {api.status === 'healthy' ? '正常' :
                                       api.status === 'degraded' ? '降级' :
                                       '故障'}
                                    </span>
                                    <span className="text-xs text-slate-500">{api.latency}ms</span>
                                  </div>
                                </div>
                                {api.error && (
                                  <p className="text-xs text-red-400 mt-2">{api.error}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-4 text-xs text-slate-500 text-center">
                  自动刷新: 每 30 秒
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              /* 数据状态监控 */
              <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">数据监控</h2>
                  {monitoringLoading && (
                    <span className="text-xs text-slate-500">刷新中...</span>
                  )}
                </div>

                {dataStatusData?.summary && (
                  <>
                    {/* 总体统计 */}
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-white">{dataStatusData.summary.total}</p>
                        <p className="text-xs text-slate-400 mt-1">总数</p>
                      </div>
                      <div className="bg-green-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-400">{dataStatusData.summary.active}</p>
                        <p className="text-xs text-slate-400 mt-1">活跃</p>
                      </div>
                      <div className="bg-yellow-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-yellow-400">{dataStatusData.summary.stale}</p>
                        <p className="text-xs text-slate-400 mt-1">过期</p>
                      </div>
                      <div className="bg-red-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-red-400">{dataStatusData.summary.error}</p>
                        <p className="text-xs text-slate-400 mt-1">错误</p>
                      </div>
                    </div>

                    {/* 数据健康度 */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">数据健康度</span>
                        <span className="text-lg font-bold text-white">{dataStatusData.summary.healthPercentage}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            parseFloat(dataStatusData.summary.healthPercentage) >= 80 ? 'bg-green-500' :
                            parseFloat(dataStatusData.summary.healthPercentage) >= 50 ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: dataStatusData.summary.healthPercentage + '%' }}
                        />
                      </div>
                    </div>

                    {/* 数据模块列表 */}
                    <div className="space-y-3">
                      {dataStatusData.modules.map(module => (
                        <div key={module.id} className="bg-slate-800/50 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  module.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  module.status === 'stale' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {module.status === 'active' ? '活跃' :
                                   module.status === 'stale' ? '过期' :
                                   '错误'}
                                </span>
                                <span className="text-sm font-medium text-white">{module.name}</span>
                              </div>
                              <p className="text-xs text-slate-500 mt-1">{module.endpoint}</p>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <div className="text-right">
                                <p className="text-slate-400">数据点</p>
                                <p className="text-white">{module.dataPoints}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-400">延迟</p>
                                <p className="text-white">{module.latency}ms</p>
                              </div>
                              <div className="text-right">
                                <p className="text-slate-400">更新</p>
                                <p className="text-xs text-white">{formatTime(module.lastUpdate)}</p>
                              </div>
                            </div>
                          </div>
                          {module.error && (
                            <p className="text-xs text-red-400 mt-2">{module.error}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                <div className="mt-4 text-xs text-slate-500 text-center">
                  自动刷新: 每 30 秒
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 提示信息 */}
        <div className="mt-6 bg-slate-900/50 rounded-xl p-4 border border-slate-800">
          <p className="text-xs text-slate-500 text-center">
            ⚠️ 所有数据保存在服务器内存中，重启后需要重新配置。
            建议在 Railway 环境变量中设置 NEWS_API_KEY 永久保存。
          </p>
        </div>
      </div>
    </div>
  );
}
