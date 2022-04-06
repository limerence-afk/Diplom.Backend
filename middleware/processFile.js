const util = require('util');
const Multer = require('multer');
const maxSize = 10 * 1024 * 1024;
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: { fileSize: maxSize },
}).single('file');
const processFile = util.promisify(multer);
module.exports = processFile;
