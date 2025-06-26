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
      const { id: credentialsId } = request.auth.credentials;
      const playlists = await this._playlistsService.getPlaylists(
        credentialsId
      );

      return {
        status: "success",
        data: {
          playlists,
        },
      };
    };

    this.deletePlaylistHandler = async (request) => {
      const { id } = request.params;
      const { id: credentialsId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialsId);
      await this._playlistsService.deletePlaylistById(id);

      return {
        status: "success",
        message: "Playlist berhasil dihapus",
      };
    };

    this.postSongToPlaylistHandler = async (request, h) => {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialsId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialsId);
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
      const { id: credentialsId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialsId);
      const playlist = await this._playlistsService.getSongsInPlaylist(id);

      return {
        status: "success",
        data: {
          playlist,
        },
      };
    };

    this.deleteSongFromPlaylistHandler = async (request) => {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      const { songId } = request.payload;
      const { id: credentialsId } = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialsId);
      await this._playlistsService.deleteSongFromPlaylist(id, songId);

      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    };
  }
}

module.exports = PlaylistsHandler;
