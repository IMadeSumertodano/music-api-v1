class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    this.postExportPlaylistsHandler = async (request, h) => {
      this._validator.validateExportPlaylistsPayload(request.payload);

      const { targetEmail } = request.payload;
      const { id: userId } = request.auth.credentials;
      const { id } = request.params;

      // Validasi akses dan keberadaan playlist
      await this._playlistsService.verifyPlaylistAccess(id, userId);

      const message = {
        playlistId: id,
        targetEmail,
        userId,
      };

      // mengirim pesan ke queue dengan fungsi sendMessage
      await this._producerService.sendMessage(
        "export:playlists",
        JSON.stringify(message)
      );

      const response = h.response({
        status: "success",
        message: "Permintaan Anda sedang kami proses",
      });
      response.code(201);
      return response;
    };
  }
}

module.exports = ExportsHandler;
