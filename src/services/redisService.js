import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT),
  },
});

// Add error handling
client.on("error", (error) => {
  console.error("Redis connection error:", error);
});

client.on("connect", () => {
  console.log("Connected to Redis successfully");
});

// Connect to Redis when the service is initialized
client.connect().catch(console.error);

const CACHE_DURATION = 60 * 5; // 5 minutes in seconds

export const cacheService = {
  async get(key) {
    try {
      const cachedData = await client.get(key);
      return cachedData ? JSON.parse(cachedData) : null;
    } catch (error) {
      console.error("Redis GET Error:", error);
      return null;
    }
  },

  async set(key, data) {
    try {
      await client.set(key, JSON.stringify(data), {
        EX: CACHE_DURATION,
      });
    } catch (error) {
      console.error("Redis SET Error:", error);
    }
  },

  generateKey(endpoint, params = {}) {
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `coingecko:${endpoint}${sortedParams ? `:${sortedParams}` : ""}`;
  },
};
