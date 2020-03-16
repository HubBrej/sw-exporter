const crypto = require('crypto');
const zlib = require('zlib');

const encryptkey = require(`./binaries/key-${process.platform}-${process.arch}`);

function decrypt(text) {
  const key = encryptkey.key();
  const algorithm = 'aes-128-cbc';
  let decipher = crypto.createDecipheriv(algorithm, key, '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00');
  let dec = decipher.update(text, 'base64', 'latin1');
  dec += decipher.final('latin1');

  return dec;
}
function encrypt(text) {
  const key = encryptkey.key();
  const algorithm = 'aes-128-cbc';

  let cipher = crypto.createCipheriv(algorithm, key, '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00');
  let enc = cipher.update(text, 'latin1', 'base64');
  enc += cipher.final('base64');

  return enc;
}


module.exports = {
  decrypt_request: text => JSON.parse(decrypt(text)),
  decrypt_response: text => JSON.parse(zlib.inflateSync(Buffer.from(decrypt(text), 'latin1'))),
  encrypt: text => encrypt(text),
  decrypt: text => decrypt(text)
};
