// this initiates an express.js app that supports two endpoints

// endpoints
// a. /download/:pubkey => generates a new unique download object as a bandwidth test
// b. /downloads/ => lists past downloads

const express = require('express')
const sha256 = require('sha256')

const app = express()
let downloads = {};


app.get('/download/:pubkey', function (req, res) {
  let payload = generateRandomString(1); // 1MB
  let hash = sha256(payload, { asString: true });
  let base64Hash = Buffer.from(hash).toString('base64'); 
  downloads[base64Hash] = req.params.pubkey;
  console.log('downloads is now', downloads)
  res.send(payload);
})

app.get('/downloads/:hash', function (req, res) {
    console.log('called downloads, checking  ', downloads)
    let downloadRecord = downloads[req.params.hash]
    res.json(downloadRecord);
})

app.listen(3001)


// support
function generateRandomString(sizeInMB) {
    const sizeInBytes = sizeInMB * 1024 * 1024;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';

    for (let i = 0; i < sizeInBytes; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
}
