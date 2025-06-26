const InvariantError = require("../../exceptions/InvariantError");
const {
  PlaylistPayloadSchema,
  SongsToPlaylistPayloadSchema,
} = require("./schema");

const PlaylistsValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongToPlaylistPayload: (payload) => {
    const validateResult = SongsToPlaylistPayloadSchema.validate(payload);
    if (validateResult.error) {
      throw new InvariantError(validateResult.error.message);
    }
  },
};

module.exports = PlaylistsValidator;
