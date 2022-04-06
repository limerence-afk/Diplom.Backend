const bucketName = process.env.BUCKET_NAME;
const { initializeApp, cert } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');

const { randomUUID } = require('crypto');
const serviceAccount = require('../service_account.json');
const path = require('path');
initializeApp({
  credential: cert(serviceAccount),
  storageBucket: `${bucketName}.appspot.com`,
});
console.log(bucketName);
const storage = getStorage();
const bucket = storage.bucket();

async function uploadFile(folder, file) {
  const fileName = `${folder}/${randomUUID()}${path.extname(
    file.originalname
  )}`;
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
  });
  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      reject(err);
    });
    blobStream.on('finish', async (data) => {
      // Create URL for directly file access via HTTP.
      const publicUrl = bucket.file(fileName).publicUrl();

      try {
        // Make the file public
        await bucket.file(fileName).makePublic();
      } catch {
        reject('could not make file public');
      }
      resolve({ url: publicUrl });
    });
    blobStream.end(file.buffer);
  });
}

module.exports = uploadFile;
