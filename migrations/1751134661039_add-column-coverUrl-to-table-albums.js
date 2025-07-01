exports.up = (pgm) => {
  pgm.addColumn("albums", {
    coverUrl: {
      type: "VARCHAR(50)",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn("albums", "coverUrl");
};
