class PlaylistsHandler {
  constructor(playlistsService, usersService, tokenManager, validator) {
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._tokenManager = tokenManager;
    this._validator = validator;

    this.postPlaylistHandler = async (request, h) => {
      this._validator.validatePlaylistPayload(request.payload);
      const { name } = request.payload;
      const { id: credentialsId } = request.auth.credentials;

      const playlistId = await this._playlistsService.addPlaylist({
        name,
        owner: credentialsId,
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
      const { id: userId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(userId);

      return {
        status: "success",
        data: {
          playlists,
        },
      };
    };

    this.deletePlaylistHandler = async (request) => {
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);
      await this._playlistsService.deletePlaylistById(playlistId);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    };

    this.postSongToPlaylistHandler = async (request, h) => {
      this._validator.validateSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      await this._playlistsService.addSongToPlaylist(playlistId, songId);

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan ke playlist",
      });
      response.code(201);
      return response;
    };

    this.getSongInPlaylistHandler = async (request) => {
      const { id: playlistId } = request.params;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      const playlist = await this._playlistsService.getSongsInPlaylist(
        playlistId
      );

      return {
        status: "success",
        data: {
          playlist,
        },
      };
    };

    this.deleteSongFromPlaylistHandler = async (request) => {
      this._validator.validateSongPayload(request.payload);
      const { id: playlistId } = request.params;
      const { songId } = request.payload;
      const { id: userId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(playlistId, userId);
      await this._playlistsService.deleteSongFromPlaylist(playlistId, songId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    };
  }
}

module.exports = PlaylistsHandler;
