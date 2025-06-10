const mapDBToModelSong = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
});

const mapDBToModelAlbum = ({ id, name, year }) => ({ id, name, year });

module.exports = { mapDBToModelSong, mapDBToModelAlbum };
