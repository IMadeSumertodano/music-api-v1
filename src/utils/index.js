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

const mapDBToModelAlbum = ({ id, name, year, coverUrl }) => ({
  id,
  name,
  year,
  coverUrl: coverUrl ?? null,
});

module.exports = { mapDBToModelSong, mapDBToModelAlbum };
