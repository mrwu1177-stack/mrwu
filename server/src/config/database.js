import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const signalsFile = path.join(dataDir, 'signals.json');
const marketDataFile = path.join(dataDir, 'market.json');
const fearGreedFile = path.join(dataDir, 'fear-greed.json');

// 确保数据目录存在
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// 读取文件
function readData(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    }
    return [];
  } catch (error) {
    console.error('读取数据失败:', error.message);
    return [];
  }
}

// 写入文件
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return { success: true };
  } catch (error) {
    console.error('写入数据失败:', error.message);
    return { success: false, error: error.message };
  }
}

// 异动信号模型
export const AnomalySignal = {
  // 保存异动信号
  async save(signals) {
    try {
      const existingSignals = readData(signalsFile);
      const newSignals = signals.map(s => ({
        ...s,
        id: Date.now() + Math.random(),
        created_at: Math.floor(Date.now() / 1000)
      }));
      const allSignals = [...newSignals, ...existingSignals].slice(0, 500); // 保留最近500条
      return writeData(signalsFile, allSignals);
    } catch (error) {
      console.error('保存异动信号失败:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 获取最近的异动信号
  async getRecent(limit = 50) {
    try {
      const signals = readData(signalsFile);
      return signals.slice(0, limit);
    } catch (error) {
      console.error('获取异动信号失败:', error.message);
      return [];
    }
  },

  // 获取指定时间范围的信号
  async getByTimeRange(startTime, endTime) {
    try {
      const signals = readData(signalsFile);
      return signals.filter(s => 
        s.detected_at >= startTime && s.detected_at <= endTime
      ).sort((a, b) => b.detected_at - a.detected_at);
    } catch (error) {
      console.error('获取异动信号失败:', error.message);
      return [];
    }
  },

  // 删除旧数据（保留最近7天）
  async cleanup() {
    try {
      const signals = readData(signalsFile);
      const sevenDaysAgo = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);
      const filtered = signals.filter(s => s.detected_at >= sevenDaysAgo);
      writeData(signalsFile, filtered);
      console.log(`清理异动信号: ${signals.length - filtered.length} 条`);
      return signals.length - filtered.length;
    } catch (error) {
      console.error('清理异动信号失败:', error.message);
      return 0;
    }
  }
};

// 市场数据模型
export const MarketData = {
  // 更新市场数据
  async upsert(data) {
    try {
      const marketData = readData(marketDataFile);
      const existingIndex = marketData.findIndex(m => m.symbol === data.symbol);
      const newEntry = {
        ...data,
        updated_at: Math.floor(Date.now() / 1000),
        created_at: existingIndex >= 0 ? marketData[existingIndex].created_at : Math.floor(Date.now() / 1000)
      };

      if (existingIndex >= 0) {
        marketData[existingIndex] = newEntry;
      } else {
        marketData.push(newEntry);
      }

      return writeData(marketDataFile, marketData);
    } catch (error) {
      console.error('更新市场数据失败:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 批量更新
  async upsertMany(dataArray) {
    try {
      const marketData = readData(marketDataFile);
      const now = Math.floor(Date.now() / 1000);

      for (const data of dataArray) {
        const existingIndex = marketData.findIndex(m => m.symbol === data.symbol);
        const newEntry = {
          ...data,
          updated_at: now,
          created_at: existingIndex >= 0 ? marketData[existingIndex].created_at : now
        };

        if (existingIndex >= 0) {
          marketData[existingIndex] = newEntry;
        } else {
          marketData.push(newEntry);
        }
      }

      return writeData(marketDataFile, marketData);
    } catch (error) {
      console.error('批量更新市场数据失败:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 获取所有市场数据
  async getAll() {
    try {
      return readData(marketDataFile);
    } catch (error) {
      console.error('获取市场数据失败:', error.message);
      return [];
    }
  },

  // 获取指定币种数据
  async getBySymbol(symbol) {
    try {
      const marketData = readData(marketDataFile);
      return marketData.find(m => m.symbol === symbol) || null;
    } catch (error) {
      console.error('获取市场数据失败:', error.message);
      return null;
    }
  }
};

// 恐贪指数模型
export const FearGreed = {
  // 保存恐贪指数
  async save(data) {
    try {
      const history = readData(fearGreedFile);
      const newEntry = {
        ...data,
        id: Date.now(),
        timestamp: Math.floor(data.timestamp / 1000),
        created_at: Math.floor(Date.now() / 1000)
      };
      history.unshift(newEntry);
      return writeData(fearGreedFile, history);
    } catch (error) {
      console.error('保存恐贪指数失败:', error.message);
      return { success: false, error: error.message };
    }
  },

  // 获取最新的恐贪指数
  async getLatest() {
    try {
      const history = readData(fearGreedFile);
      return history.length > 0 ? history[0] : null;
    } catch (error) {
      console.error('获取恐贪指数失败:', error.message);
      return null;
    }
  },

  // 获取历史数据
  async getHistory(limit = 30) {
    try {
      const history = readData(fearGreedFile);
      return history.slice(0, limit);
    } catch (error) {
      console.error('获取恐贪指数失败:', error.message);
      return [];
    }
  },

  // 删除旧数据（保留最近30天）
  async cleanup() {
    try {
      const history = readData(fearGreedFile);
      const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
      const filtered = history.filter(s => s.created_at >= thirtyDaysAgo);
      writeData(fearGreedFile, filtered);
      console.log(`清理恐贪指数: ${history.length - filtered.length} 条`);
      return history.length - filtered.length;
    } catch (error) {
      console.error('清理恐贪指数失败:', error.message);
      return 0;
    }
  }
};

export default {
  AnomalySignal,
  MarketData,
  FearGreed
};
