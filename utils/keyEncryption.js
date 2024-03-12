const crypto = require('crypto');

const algorithm = 'aes256';

const iv = Buffer.from(process.env.BANKKEY, 'utf8');

const padding = process.env.padding;

let secertKey;


function encryptionKeys(password, message) {

    if (password.length < 32) {
        console.log("given size", password.length);
        let required = 32 - password.length;
        console.log("required more", required)
        secertKey = password.concat(padding.substring(0, required));
        console.log("secertKey", secertKey, secertKey.length);
    }
    if (password.length > 32) {
        new Error("Password too long");
        return;
    }
    const key = Buffer.from(secertKey, 'utf8');
    console.log("key created ", key, key.length);
    console.log("iv bank", iv, iv.length);

    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encryptedData = cipher.update(message.toString(), "utf-8", "hex");
    encryptedData += cipher.final("hex");

    return encryptedData

}

function decryptionKeys(encryptedData, password) {
    if (password.length < 32) {
        let required = 32 - password.length;
        secertKey = password.concat(padding.substring(0, required));
    }
    if (password.length > 32) {
        new Error("Password too long");
        return;
    }
    const key = Buffer.from(secertKey, 'utf8');

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decryptedData = decipher.update(encryptedData, "hex", "utf-8");

    decryptedData += decipher.final("utf8");

    return decryptedData;
}

module.exports = { encryptionKeys, decryptionKeys }