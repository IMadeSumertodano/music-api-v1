class AlbumsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postAlbumHandler = (request, h) => {
      this._validator.validateAlbumPayload(request.payload);
      const { name, year } = request.payload;

      const albumId = this._service.addAlbum({
        name,
        year,
      });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: { albumId },
      });
      response.code(201);
      return response;
    };

    this.getAlbumsHandler = () => {
      const albums = this._service.getAlbums();
      return {
        status: "success",
        data: {
          albums,
        },
      };
    };

    this.getAlbumByIdHandler = (request, h) => {
      const { id } = request.params;
      const album = this._service.getAlbumById(id);
      return {
        status: "success",
        data: {
          album,
        },
      };
    };

    this.putAlbumByIdHandler = (request, h) => {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      this._service.putAlbumById(id, request.payload);
      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    };

    this.deleteAlbumByIdHandler = (request, h) => {
      const { id } = request.params;
      this._service.deleteAlbumById(id);
      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    };
  }
}

module.exports = AlbumsHandler;
