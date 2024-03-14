

function encryption(key, message) {
    console.log("Amount Encryption", key, message);
    const k1 = BigInt(BigInt(key.g) ** BigInt(message)) % BigInt(key.n * key.n);
    const k2 = BigInt(BigInt(key.r) ** BigInt(key.n)) % BigInt(key.n * key.n);

    const cipher = (k1 * k2) % BigInt(key.n * key.n);
    console.log("value ", cipher);
    return cipher;
}

function decryption(key, cipher) {
    let dep = (((BigInt(cipher) ** BigInt(key.gLambda)) % BigInt(key.n * key.n)) - 1n) / BigInt(key.n);
    let mess = (dep * key.gMu) % BigInt(key.n);
    console.log("Message:\t", mess);
    return mess;
}

module.exports = { encryption, decryption }