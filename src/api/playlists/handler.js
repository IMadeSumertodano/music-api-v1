class PlaylistsHandler {
  constructor(playlistsService, validator) {
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postPlaylistHandler = async (request, h) => {
      // validasi payload
      this._validator.validatePostPlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      // tambahkan playlist ke database
      const playlistId = await this._playlistsService.addPlaylist({
        name,
        owner: credentialId,
      });

      const response = h.response({
        status: "success",
        message: "Playlist berhasil ditambahkan",
        data: { playlistId },
      });
      response.code(201);
      return response;
    };

    this.getPlaylistHandler = async (request) => {
      const { id: credentialId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(credentialId);

      return {
        status: "success",
        data: {
          playlists,
        },
      };
    };

    this.deletePlaylistHandler = async (request) => {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    };

    this.postSongToPlaylistHandler = async (request, h) => {
      this._validator.validatePostSongToPlaylistPayload(request.payload);
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.addSongToPlaylist(id, songId);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });
      response.code(201);
      return response;
    };

    this.getSongInPlaylistHandler = async (request) => {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const playlist = await this._playlistsService.getSongsInPlaylist(id);

      return {
        status: "success",
        data: {
          playlist,
        },
      };
    };

    this.deleteSongFromPlaylistHandler = async (request) => {
      this._validator.validatePostSongPayload(request.payload);
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      await this._playlistsService.deleteSongFromPlaylist(id, songId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    };

    this.getPlaylistActivitiesHandler = async (request) => {
      const { id } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      const result = await this._playlistsService.getPlaylistActivities(id);

      return {
        status: "success",
        data: result,
      };
    };
  }
}

module.exports = PlaylistsHandler;
