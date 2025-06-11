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

    this.getSongsHandler = async (request) => {
      const { title = "", performer = "" } = request.query;
      this._validator.validateSongQuery({ title, performer });

      const songs = await this._service.getSongs({ title, performer });
      return {
        status: "success",
        data: {
          songs,
        },
      };
    };

    this.getSongByIdHandler = async (request) => {
      const { id } = request.params;
      const song = await this._service.getSongById(id);
      return {
        status: "success",
        data: {
          song,
        },
      };
    };

    this.putSongByIdHandler = async (request) => {
      this._validator.validateSongPayload(request.payload);
      const { id } = request.params;
      await this._service.editSongById(id, request.payload);
      return {
        status: "success",
        message: "Lagu berhasil diperbarui",
      };
    };

    this.deleteSongByIdHandler = async (request) => {
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
