const { Accounts } = require("../models/Accounts");
const { Key } = require("../models/Keys");
const { encryptionKeys } = require('../utils/keyEncryption');
const { encryption } = require('./paillier-algo');



function isPrime(n) {
    if (n < 2) return false;
    for (let i = 2; i * i <= n; i++) {
        if (n % i === 0) return false;
    }
    return true;
}
function lcm(a, b) {
    return (a * b) / gcd(a, b);
}
function gcd(a, b) {
    while (b > 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}
function gcdExtended(a, b) {
    if (a === 0n) {
        return [b, 0n, 1n];
    }

    const [gcd, x1, y1] = gcdExtended(b % a, a);
    const x = y1 - (b / a) * x1;
    const y = x1;

    return [gcd, x, y];
}
function modInverse(a, m) {
    const [gcd, x, y] = gcdExtended(a, m);
    if (gcd !== 1n) {
        throw new Error("Inverse does not exist");
    }
    return (x % m + m) % m;
}

async function KeyGenerator(accountID, password) {
    console.log("password for key encryption", password);
    let max = process.env.KeyRange;
    console.log("Key generator function", max);
    let p, q, n, g, r, gMu, gLambda;
    try {
        p = Math.floor(Math.random() * max + 20);
        while (!isPrime(p))
            p = Math.floor(Math.random() * max + 20);

        q = Math.floor(Math.random() * max + 20);
        while (!isPrime(q))
            q = Math.floor(Math.random() * max + 20);

        while (p == q) {
            q = Math.floor(Math.random() * max + 20);
            while (!isPrime(q))
                q = Math.floor(Math.random() * max + 20);
        }

        n = p * q;
        gLambda = lcm(p - 1, q - 1);

        g = Math.floor(Math.random() * 150 + 20);
        while (gcd(g, n * n) != 1)
            g = Math.floor(Math.random() * 150 + 20);


        r = Math.floor(Math.random() * 150 + 20);


        const l = (((BigInt(g) ** BigInt(gLambda)) % BigInt(n * n)) - 1n) / BigInt(n);


        gMu = modInverse(l, BigInt(n));
        console.log("keys", p, q, n, g, r, gMu, gLambda, accountID);
    } catch (err) {
        console.log(err);
        return;
    } finally {
        console.log("finally keyGenrator");
        const newKey = new Key({
            accountID: accountID,
            publicKey: {
                n: n,
                g: g,
                r: r
            },
            privateKey: {
                gMu: encryptionKeys(password, gMu),
                gLambda: encryptionKeys(password, gLambda)
            }
        });
        newKey.save().then(res => {
            const initialBalance = 1000;
            const cipher = encryption({
                n: n,
                g: g,
                r: r
            }, initialBalance);
            const newAccount = new Accounts({
                balance: cipher,
                accountID: accountID,
            })
            newAccount.save();
        });
    }

}

module.exports = { KeyGenerator }