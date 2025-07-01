/* eslint-disable no-undef */
class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    this.postUploadImageHandler = async (request, h) => {
      const { cover } = request.payload;
      const { id } = request.params;

      this._validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);

      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

      // simpan coverUrl ke database
      await this._albumsService.updateCoverUrlById(id, coverUrl);

      const response = h.response({
        status: "success",
        message: "Sampul berhasil diunggah",
      });
      response.code(201);
      return response;
    };
  }
}

module.exports = UploadsHandler;
