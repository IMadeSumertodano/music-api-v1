const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: (request, h) => handler.postPlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: (request, h) => handler.getPlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: (request, h) => handler.deletePlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
  {
    method: "POST",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.postSongToPlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.getSongInPlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}/songs",
    handler: (request, h) => handler.deleteSongFromPlaylistHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
];

module.exports = routes;
