import axios from "axios";
import { cacheService } from "./cacheService";

const BASE_URL = "https://api.coingecko.com/api/v3";
const RETRY_DELAY = 1000; // 1 second delay between retries
const MAX_RETRIES = 3;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const coinGeckoService = {
  async fetchWithRetry(url, params = null, retries = 0) {
    try {
      const response = await axios.get(url, params ? { params } : undefined);
      return response.data;
    } catch (error) {
      if (error.response?.status === 429 && retries < MAX_RETRIES) {
        console.log(`Rate limited, retrying in ${RETRY_DELAY}ms...`);
        await sleep(RETRY_DELAY * (retries + 1)); // Exponential backoff
        return this.fetchWithRetry(url, params, retries + 1);
      }
      throw error;
    }
  },

  async getMarkets(params) {
    const cacheKey = cacheService.generateKey("markets", params);
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached market data");
      return cachedData;
    }

    const data = await this.fetchWithRetry(`${BASE_URL}/coins/markets`, params);
    cacheService.set(cacheKey, data);
    return data;
  },

  async getCoinData(coinId) {
    const cacheKey = cacheService.generateKey(`coins/${coinId}`);
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      console.log(`Returning cached data for ${coinId}`);
      return cachedData;
    }

    console.log(`Fetching fresh data for ${coinId}`);
    const data = await this.fetchWithRetry(`${BASE_URL}/coins/${coinId}`, {
      localization: false,
      tickers: false,
      market_data: true,
      community_data: false,
      developer_data: false,
      sparkline: false,
    });

    cacheService.set(cacheKey, data);
    return data;
  },

  async getMarketChart(coinId, params) {
    const cacheKey = cacheService.generateKey(
      `coins/${coinId}/market_chart`,
      params
    );
    const cachedData = cacheService.get(cacheKey);

    if (cachedData) {
      console.log("Returning cached chart data");
      return cachedData;
    }

    const data = await this.fetchWithRetry(
      `${BASE_URL}/coins/${coinId}/market_chart`,
      params
    );
    cacheService.set(cacheKey, data);
    return data;
  },
};
