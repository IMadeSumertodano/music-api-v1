const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModelAlbum } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._pool = new Pool();
  }

  async addAlbum({ name, year }) {
    const id = `album-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO albums VALUES($1, $2, $3) RETURNING id",
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Album gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getAlbumById(id) {
    // Ambil data album
    const albumQuery = {
      text: "SELECT * FROM albums WHERE id = $1",
      values: [id],
    };
    const albumResult = await this._pool.query(albumQuery);

    if (!albumResult.rows.length) {
      throw new NotFoundError("Album tidak ditemukan");
    }

    const album = mapDBToModelAlbum(albumResult.rows[0]);

    // Ambil daftar lagu berdasarkan albumId
    const songsQuery = {
      text: 'SELECT id, title, performer FROM songs WHERE "albumId" = $1',
      values: [id],
    };
    const songsResult = await this._pool.query(songsQuery);

    // Gabungkan data album dengan daftar lagu
    return {
      ...album,
      songs: songsResult.rows,
    };
  }

  async editAlbumById(id, { name, year }) {
    const query = {
      text: "UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id",
      values: [name, year, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui album. Id tidak ditemukan");
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: "DELETE FROM albums WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Album gagal dihapus. Id tidak ditemukan");
    }
  }

  async updateCoverUrlById(id, coverUrl) {
    const query = {
      text: `UPDATE albums SET "coverUrl" = $1 WHERE id = $2 RETURNING id`,
      values: [coverUrl, id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Gagal memperbarui cover. Album tidak ditemukan");
    }
  }

  // fitur like album
  async likeAlbum(userId, albumId) {
    // cek apakah album ada
    const albumResult = await this._pool.query({
      text: "SELECT id FROM albums WHERE id = $1",
      values: [albumId],
    });

    if (!albumResult.rowCount) throw new NotFoundError("Album tidak ditemukan");

    // cek apakah user sudah menyukai album
    const existingLike = await this._pool.query({
      text: "SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    });

    if (existingLike.rowCount > 0) {
      throw new InvariantError("Anda sudah menyukai album ini");
    }

    const id = `like-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES ($1, $2, $3)",
      values: [id, userId, albumId],
    };

    await this._pool.query(query);
  }

  async unlikeAlbum(userId, albumId) {
    const query = {
      text: "DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError(
        "Gagal batal menyukai album. Mungkin belum disukai."
      );
    }
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: "SELECT COUNT(*) AS likes FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);
    return parseInt(result.rows[0].likes, 10);
  }
}

module.exports = AlbumsService;
