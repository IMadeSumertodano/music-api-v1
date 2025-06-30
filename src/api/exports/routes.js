const routes = (handler) => [
  {
    method: "POST",
    path: "/export/playlists",
    handler: (request, h) => handler.postExportNotesHandler(request, h),
    options: {
      auth: "musicsapp_jwt",
    },
  },
];

module.exports = routes;
