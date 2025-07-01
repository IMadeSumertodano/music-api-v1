const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

class PlaylistsService {
  constructor(songsService, collaborationsService) {
    this._pool = new Pool();
    this._songsService = songsService;
    this._collaborationsService = collaborationsService;
  }

  async addPlaylist({ name, owner }) {
    const id = `playlist-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlists VALUES($1, $2, $3) RETURNING id",
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError("Playlist gagal ditambahkan");
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.id, playlists.name, users.username
      FROM playlists
      LEFT JOIN users ON playlists.owner = users.id
      LEFT JOIN collaborations ON collaborations.playlist_id = playlists.id
      WHERE playlists.owner = $1 OR collaborations.user_id = $1
      GROUP BY playlists.id, users.username`,
      values: [owner],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deletePlaylistById(id) {
    const query = {
      text: "DELETE FROM playlists WHERE id = $1 RETURNING id",
      values: [id],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError("Playlist gagal dihapus. Id tidak ditemukan");
    }
  }

  async addSongToPlaylist(playlistId, songId) {
    // Validasi apakah songId ada
    await this._songsService.getSongById(songId);

    const id = `playlistsong-${nanoid(16)}`;
    const query = {
      text: "INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id",
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError("Lagu gagal ditambahkan ke playlist");
    }
  }

  async getSongsInPlaylist(playlistId) {
    const playlistQuery = {
      text: `
        SELECT playlists.id, playlists.name, users.username,
               songs.id AS song_id, songs.title, songs.performer
        FROM playlists
        LEFT JOIN users ON playlists.owner = users.id
        LEFT JOIN playlist_songs ON playlist_songs.playlist_id = playlists.id
        LEFT JOIN songs ON songs.id = playlist_songs.song_id
        WHERE playlists.id = $1
      `,
      values: [playlistId],
    };

    const result = await this._pool.query(playlistQuery);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const { id, name, username } = result.rows[0];
    const songs = result.rows
      .filter((row) => row.song_id)
      .map((row) => ({
        id: row.song_id,
        title: row.title,
        performer: row.performer,
      }));

    return {
      id,
      name,
      username,
      songs,
    };
  }

  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: "DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2 RETURNING id",
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(
        "Lagu gagal dihapus dari playlist. Lagu tidak ditemukan dalam playlist ini"
      );
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlist tidak ditemukan");
    }

    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async verifyPlaylistAccess(id, owner) {
    try {
      await this.verifyPlaylistOwner(id, owner);
    } catch (error) {
      if (error instanceof NotFoundError) {
        // jika playlist tidak ada kirim error 404
        throw error;
      }

      // playlist ada tapi bukan owner atau kolaborator
      try {
        await this._collaborationsService.verifyCollaborator(id, owner);
      } catch {
        // bukan kolaborator kirim error 403
        throw new AuthorizationError(
          "Anda tidak berhak mengakses resource ini"
        );
      }
    }
  }

  async addActivity({ playlistId, songId, owner, action }) {
    const id = `activity-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: `INSERT INTO playlist_song_activities (id, playlist_id, song_id, user_id, action, time)
           VALUES ($1, $2, $3, $4, $5, $6)`,
      values: [id, playlistId, songId, owner, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `
      SELECT users.username, songs.title, psa.action, psa.time
      FROM playlist_song_activities psa
      JOIN users ON users.id = psa.user_id
      JOIN songs ON songs.id = psa.song_id
      WHERE psa.playlist_id = $1
      ORDER BY psa.time ASC
    `,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return {
      playlistId,
      activities: result.rows.map((row) => ({
        username: row.username,
        title: row.title,
        action: row.action,
        time: row.time.toISOString(),
      })),
    };
  }
}

module.exports = PlaylistsService;
