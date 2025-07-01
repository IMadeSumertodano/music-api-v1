/* eslint-disable no-undef */
const path = require("path");

const routes = (handler) => [
  {
    method: "POST",
    path: "/albums/{id}/covers",
    handler: (request, h) => handler.postUploadImageHandler(request, h),
    options: {
      payload: {
        allow: "multipart/form-data",
        multipart: true,
        output: "stream",
        maxBytes: 512000, // batas maksimal 512 KB
      },
    },
  },
  {
    method: "GET",
    path: "/albums/{param*}",
    handler: {
      directory: {
        path: path.resolve(__dirname, "file"),
      },
    },
  },
];

module.exports = routes;
