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

const mapDBToModelAlbum = ({ id, name, year, cover_url }) => ({
  id,
  name,
  year,
  coverUrl: cover_url || null,
});

module.exports = { mapDBToModelSong, mapDBToModelAlbum };
