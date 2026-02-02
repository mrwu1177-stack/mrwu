// API服务 - 从后端获取数据

const API_BASE_URL = 'http://localhost:5001/api';

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  market_cap: number;
  updated_at: number;
}

export interface AnomalySignal {
  id: number;
  symbol: string;
  signal_type: string;
  price: number;
  volume: number;
  volume_ratio: number;
  change24h: number;
  direction: string;
  detected_at: number;
}

export interface FearGreedData {
  id: number;
  value: number;
  classification: string;
  timestamp: number;
  created_at: number;
}

export interface GlobalMarketData {
  totalMarketCap: number;
  totalVolume: number;
  btcDominance: number;
  ethDominance: number;
  activeCryptos: number;
}

// 获取市场数据
export async function fetchMarketData(): Promise<MarketData[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/market-data`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('获取市场数据失败:', error);
    return [];
  }
}

// 获取异动信号
export async function fetchAnomalySignals(limit = 50): Promise<AnomalySignal[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/signals?limit=${limit}`);
    const result = await response.json();
    return result.success ? result.data : [];
  } catch (error) {
    console.error('获取异动信号失败:', error);
    return [];
  }
}

// 获取恐贪指数
export async function fetchFearGreed(): Promise<FearGreedData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/fear-greed`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('获取恐贪指数失败:', error);
    return null;
  }
}

// 获取全球市场数据
export async function fetchGlobalMarket(): Promise<GlobalMarketData | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/global-market`);
    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error('获取全球市场数据失败:', error);
    return null;
  }
}

export default {
  fetchMarketData,
  fetchAnomalySignals,
  fetchFearGreed,
  fetchGlobalMarket
};
