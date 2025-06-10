class AlbumsHandler {
  constructor(service, validator, songService) {
    this._service = service;
    this._validator = validator;
    // this._songService = songService;

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

    this.getAlbumByIdHandler = async (request, h) => {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);
      // const song = await this._songService.getSongsByAlbumId(id);
      return {
        status: "success",
        data: {
          album,
        },
      };
    };

    this.putAlbumByIdHandler = async (request, h) => {
      this._validator.validateAlbumPayload(request.payload);
      const { id } = request.params;
      await this._service.editAlbumById(id, request.payload);
      return {
        status: "success",
        message: "Album berhasil diperbarui",
      };
    };

    this.deleteAlbumByIdHandler = async (request, h) => {
      const { id } = request.params;
      await this._service.deleteAlbumById(id);
      return {
        status: "success",
        message: "Album berhasil dihapus",
      };
    };
  }
}

module.exports = AlbumsHandler;
