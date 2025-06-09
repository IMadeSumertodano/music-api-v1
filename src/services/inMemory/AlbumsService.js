const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const NotFoundError = require("../../exceptions/NotFoundError");

class AlbumsService {
  constructor() {
    this._albums = [];
  }

  addAlbum({ name, year }) {
    const id = nanoid(16);

    const newAlbum = { name, year, id };

    this._albums.push(newAlbum);

    const isSuccess =
      this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError("Catatan gagal ditambahkan");
    }

    return id;
  }

  getSongs() {
    return this._albums;
  }

  getSongById(id) {
    const album = this._albums.filter((a) => a.id === id)[0];
    if (!album) {
      throw new NotFoundError("Lagu tidak ditemukan");
    }
    return album;
  }

  editSongById(id, { name, year }) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Gagal memperbarui lagu. Id tidak ditemukan");
    }

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
    };
  }

  deleteSongByIdHandler(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError("Lagu gagal dihapus. Id tidak ditemukan");
    }

    this._albums.splice(index, 1);
  }
}

module.exports = AlbumsService;
