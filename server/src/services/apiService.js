import axios from 'axios';

// 模拟数据生成器
function generateMockData() {
  const coins = [
    { symbol: 'BTC', name: 'Bitcoin', basePrice: 67500 },
    { symbol: 'ETH', name: 'Ethereum', basePrice: 3450 },
    { symbol: 'BNB', name: 'BNB', basePrice: 580 },
    { symbol: 'SOL', name: 'Solana', basePrice: 145 },
    { symbol: 'XRP', name: 'XRP', basePrice: 2.35 },
    { symbol: 'ADA', name: 'Cardano', basePrice: 1.15 },
    { symbol: 'DOGE', name: 'Dogecoin', basePrice: 0.42 },
    { symbol: 'DOT', name: 'Polkadot', basePrice: 18.5 },
    { symbol: 'MATIC', name: 'Polygon', basePrice: 0.95 },
    { symbol: 'LINK', name: 'Chainlink', basePrice: 28.5 },
    { symbol: 'AVAX', name: 'Avalanche', basePrice: 72.5 },
    { symbol: 'UNI', name: 'Uniswap', basePrice: 17.5 },
    { symbol: 'ATOM', name: 'Cosmos', basePrice: 12.5 },
    { symbol: 'LTC', name: 'Litecoin', basePrice: 145 },
    { symbol: 'NEAR', name: 'NEAR Protocol', basePrice: 6.5 }
  ];

  const now = Date.now();

  // 生成市场数据
  const marketData = coins.map(coin => {
    const changePercent = (Math.random() - 0.5) * 20; // -10% 到 +10%
    const price = coin.basePrice * (1 + changePercent / 100);
    return {
      symbol: coin.symbol + 'USDT',
      price: price,
      change24h: changePercent,
      volume24h: coin.basePrice * 10000000 * Math.random(),
      marketCap: coin.basePrice * 1000000000 * Math.random()
    };
  });

  // 强制生成一些异动信号
  marketData[0].change24h = 15.5; // BTC上涨
  marketData[1].change24h = -12.3; // ETH下跌
  marketData[2].change24h = 18.2; // BNB大涨
  marketData[3].change24h = -14.7; // SOL大跌

  // 生成异动信号（涨跌超过8%）
  const anomalies = marketData
    .filter(ticker => Math.abs(ticker.change24h) > 8)
    .map(ticker => ({
      symbol: ticker.symbol,
      signalType: ticker.change24h > 0 ? '主拉' : '主砸',
      price: ticker.price,
      volume: ticker.volume24h,
      volumeRatio: 1.0 + Math.random(),
      change24h: ticker.change24h,
      direction: ticker.change24h > 0 ? 'up' : 'down',
      detectedAt: now - Math.floor(Math.random() * 3600000) // 过去1小时内
    }));

  // 生成恐贪指数
  const fearGreedValue = Math.floor(Math.random() * 60) + 20; // 20-80
  const fearGreedClassifications = ['极度恐慌', '恐慌', '中性', '贪婪', '极度贪婪'];
  const fgIndex = Math.floor(fearGreedValue / 20);
  const fearGreed = {
    value: fearGreedValue,
    classification: fearGreedClassifications[Math.min(fgIndex, 4)],
    timestamp: now
  };

  // 全球市场数据
  const globalMarket = {
    totalMarketCap: 2.8e12 * (1 + (Math.random() - 0.5) * 0.05),
    totalVolume: 125e9 * (1 + (Math.random() - 0.5) * 0.1),
    btcDominance: 52 + (Math.random() - 0.5) * 2,
    ethDominance: 17 + (Math.random() - 0.5) * 1,
    activeCryptos: 10000 + Math.floor(Math.random() * 500)
  };

  return {
    marketData,
    anomalies,
    fearGreed,
    globalMarket
  };
}

// API配置
const API_CONFIG = {
  // CoinGecko API (免费且稳定)
  coinGecko: {
    baseUrl: 'https://api.coingecko.com/api/v3',
    endpoints: {
      markets: '/coins/markets',
      global: '/global',
      fearGreed: 'https://api.alternative.me/fng'
    }
  }
};

// 通用API请求函数
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await axios(url, {
        timeout: 10000,
        ...options
      });
      return response.data;
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      console.log(`请求失败，重试 ${i + 1}/${maxRetries}:`, error.message);
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

// 获取市场数据（CoinGecko，失败时使用模拟数据）
export async function fetchMarketData() {
  try {
    const url = `${API_CONFIG.coinGecko.baseUrl}${API_CONFIG.coinGecko.endpoints.markets}`;
    const params = {
      vs_currency: 'usd',
      order: 'volume_desc',
      per_page: 100,
      page: 1,
      sparkline: false,
      price_change_percentage: '24h'
    };

    const data = await fetchWithRetry(url, { params });

    // 转换为标准格式
    const marketData = data.map(coin => ({
      symbol: coin.symbol.toUpperCase() + 'USDT',
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h || 0,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap
    }));

    return marketData;
  } catch (error) {
    console.error('获取市场数据失败，使用模拟数据:', error.message);
    return generateMockData().marketData;
  }
}

// 获取恐贪指数
export async function fetchFearGreedIndex() {
  try {
    const url = `${API_CONFIG.coinGecko.endpoints.fearGreed}?limit=1`;
    const data = await fetchWithRetry(url);

    if (data && data.data && data.data.length > 0) {
      const fgData = data.data[0];
      return {
        value: parseInt(fgData.value),
        classification: fgData.value_classification,
        timestamp: parseInt(fgData.timestamp) * 1000
      };
    }
    return generateMockData().fearGreed;
  } catch (error) {
    console.error('获取恐贪指数失败，使用模拟数据:', error.message);
    return generateMockData().fearGreed;
  }
}

// 获取全球市场数据
export async function fetchGlobalMarketData() {
  try {
    const url = `${API_CONFIG.coinGecko.baseUrl}${API_CONFIG.coinGecko.endpoints.global}`;
    const data = await fetchWithRetry(url);

    if (data && data.data) {
      return {
        totalMarketCap: data.data.total_market_cap?.usd || 0,
        totalVolume: data.data.total_volume?.usd || 0,
        btcDominance: data.data.market_cap_percentage?.btc || 0,
        ethDominance: data.data.market_cap_percentage?.eth || 0,
        activeCryptos: data.data.active_cryptocurrencies || 0
      };
    }
    return generateMockData().globalMarket;
  } catch (error) {
    console.error('获取全球市场数据失败，使用模拟数据:', error.message);
    return generateMockData().globalMarket;
  }
}

// 获取K线数据（用于布林带计算）- 使用CoinGecko
export async function fetchKlineData(symbol, days = 30) {
  try {
    const coinId = symbol.replace('USDT', '').toLowerCase();
    const url = `${API_CONFIG.coinGecko.baseUrl}/coins/${coinId}/market_chart`;
    const params = {
      vs_currency: 'usd',
      days: days,
      interval: 'daily'
    };

    const data = await fetchWithRetry(url, { params });

    return data.prices.map(p => ({
      time: p[0],
      open: p[1],
      high: p[1],
      low: p[1],
      close: p[1],
      volume: 0
    }));
  } catch (error) {
    console.error(`获取${symbol}K线数据失败:`, error.message);
    return [];
  }
}

// 分析异动信号
export function analyzeAnomalies(marketData) {
  const anomalies = [];

  marketData.forEach(ticker => {
    const volume24h = ticker.volume24h;
    const change24h = ticker.change24h;

    // 异动条件：
    // 1. 24h涨跌超过10%
    
    if (Math.abs(change24h) > 10) {
      anomalies.push({
        symbol: ticker.symbol,
        signalType: change24h > 0 ? '主拉' : '主砸',
        price: ticker.price,
        volume: volume24h,
        volumeRatio: 1.0,
        change24h: change24h,
        direction: change24h > 0 ? 'up' : 'down',
        detectedAt: Date.now()
      });
    }
  });

  return anomalies;
}

export default {
  fetchMarketData,
  fetchFearGreedIndex,
  fetchGlobalMarketData,
  fetchKlineData,
  analyzeAnomalies
};
