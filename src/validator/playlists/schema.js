const Joi = require("joi");

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  owner: Joi.string().required(),
});

const SongsToPlaylistPayloadSchema = Joi.object({
  songId: Joi.string().required(),
});

module.exports = { PlaylistPayloadSchema, SongsToPlaylistPayloadSchema };
