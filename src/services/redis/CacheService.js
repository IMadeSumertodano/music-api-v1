/* eslint-disable no-undef */
const redis = require("redis");

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on("error", (error) => {
      console.error(error);
    });
  }
  // mengubah this._client.connect(); menjadi asinkronus
  async connect() {
    await this._client.connect();
  }

  // memastikan durasi cache harus 30 menit (1800 detik)
  async set(key, value, expirationInSecond = 1800) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if (result === null) throw new Error("Cache tidak ditemukan");

    return result;
  }

  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;
