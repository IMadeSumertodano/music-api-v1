class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = async (request, h) => {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = await this._service.addAlbum({
        name,
        year,
      });

      const response = h.response({
        status: "success",
        message: "Album berhasil ditambahkan",
        data: { albumId },
      });
      response.code(201);
      return response;
    };

    this.getAlbumsHandler = async () => {
      const albums = await this._service.getAlbums();
      return {
        status: "success",
        data: {
          albums,
        },
      };
    };

    this.getAlbumByIdHandler = async (request) => {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      return {
        status: "success",
        data: {
          album,
        },
      };
    };

    this.putAlbumByIdHandler = async (request) => {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      await this._service.editAlbumById(id, request.payload);
      return {
        status: "success",
        message: "Album berhasil diperbarui",
      };
    };

    this.deleteAlbumByIdHandler = async (request) => {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
      return {
        status: "success",
        message: "Album berhasil dihapus",
      };
    };

    // fitur like album
    this.postLikeAlbumHandler = async (request, h) => {
      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;

      // Validasi apakah album ada
      await this._service.verifyAlbumExists(albumId);
      // validasi apakah user sudah like
      await this._service.verifyUserHasNotLiked(userId, albumId);

      // menyukai album
      await this._service.likeAlbum(userId, albumId);

      const response = h.response({
        status: "success",
        message: "Berhasil menyukai album",
      });
      response.code(201);
      return response;
    };

    this.deleteLikeAlbumHandler = async (request) => {
      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.unlikeAlbum(userId, albumId);

      return {
        status: "success",
        message: "Berhasil batal menyukai album",
      };
    };

    this.getAlbumLikesHandler = async (request, h) => {
      const { id: albumId } = request.params;

      const { likes, isCache } = await this._service.getAlbumLikes(albumId);

      const response = h.response({
        status: "success",
        data: { likes },
      });

      if (isCache) {
        response.header("X-Data-Source", "cache");
      }

      return response;
    };
  }
}

module.exports = AlbumsHandler;
