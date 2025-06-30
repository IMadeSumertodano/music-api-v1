const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists/{id}",
    handler: (request, h) => handler.postExportPlaylistsHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
];

module.exports = routes;
