const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export const cacheService = {
  get(key) {
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;

      const parsedItem = JSON.parse(item);
      if (Date.now() > parsedItem.expiry) {
        localStorage.removeItem(key);
        return null;
      }

      return parsedItem.value;
    } catch (error) {
      console.error("Cache GET Error:", error);
      return null;
    }
  },

  set(key, value) {
    try {
      const item = {
        value,
        expiry: Date.now() + CACHE_DURATION,
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error("Cache SET Error:", error);
    }
  },

  generateKey(endpoint, params = {}) {
    const sortedParams = Object.entries(params)
      .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");
    return `coingecko:${endpoint}${sortedParams ? `:${sortedParams}` : ""}`;
  },

  clear() {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("coingecko:")) {
        localStorage.removeItem(key);
      }
    });
  },
};
