class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postSongHandler = async (request, h) => {
      this._validator.validateSongPayload(request.payload);
      const {
        title = "untitled",
        year,
        genre,
        performer,
        duration,
        albumId,
      } = request.payload;

      const songId = await this._service.addSong({
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
      });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: { songId },
      });
      response.code(201);
      return response;
    };

    this.getSongsHandler = async () => {
      const songs = await this._service.getSongs();
      return {
        status: "success",
        data: {
          songs,
        },
      };
    };

    this.getSongByIdHandler = async (request, h) => {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
        },
      };
    };

    this.putSongByIdHandler = async (request, h) => {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.putSongById(id, request.payload);
      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    };

    this.deleteSongByIdHandler = async (request, h) => {
      const { id } = request.params;
      await this._service.deleteSongById(id);
      return {
        status: "success",
        message: "Lagu berhasil dihapus",
      };
    };
  }
}

module.exports = SongsHandler;
