exports.up = (pgm) => {
  pgm.createTable("playlist_songs", {
    id: {
      type: "VARCHAR(50)",
      primaryKey: true,
    },
    playlist_id: {
      type: "VARCHAR(50)",
      notNull: false,
    },
    song_id: {
      type: "VARCHAR(50)",
      notNull: false,
    },
  });

  /*
    Menambahkan constraint UNIQUE, kombinasi dari kolom playlist_id dan song_id.
    Guna menghindari duplikasi data antara nilai keduanya.
  */
  pgm.addConstraint(
    "collaborations",
    "unique_playlist_id_and_song_id",
    "UNIQUE(playlist_id, song_id)"
  );

  // memberikan constraint foreign key pada kolom playlist_id dan song_id terhadap playlists.id dan songs.id
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.playlist_id_playlists.id",
    "FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE"
  );
  pgm.addConstraint(
    "collaborations",
    "fk_collaborations.song_id_songs.id",
    "FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("playlist_songs");
};
