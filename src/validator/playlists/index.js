const InvariantError = require("../../exceptions/InvariantError");
const {
  PostPlaylistPayloadSchema,
  PostSongsToPlaylistPayloadSchema,
  DeleteSongsToPlaylistPayloadSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePostPlaylistPayload: (payload) => {
    const validationResult = PostPlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePostSongToPlaylistPayload: (payload) => {
    const validateResult = PostSongsToPlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },

  validateDeleteSongToPlaylistPayload: (payload) => {
    const validateResult = DeleteSongsToPlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
