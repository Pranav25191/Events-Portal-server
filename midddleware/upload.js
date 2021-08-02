const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, callback) => {
      console.log("erroorrrrrrr1")
    callback(null, path.join("../uploadedFiles"));
  },
  filename: (req, file, callback) => {
    const match = [
      "image/png",
      "image/jpeg",
      "application/pdf",
      "application/doc",
      "application/docx",
    ];
    console.log("erroorrrrrrr2")
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept png/jpeg.`;
      return callback(message, null);
    }
    console.log("erroorrrrrr33")
    var filename = `${Date.now()}-${file.originalname}`;
    callback(null, filename);
  },
});

console.log("inside middleware");
var uploadFiles = multer({ storage: storage }).array("multi-files", 5);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
