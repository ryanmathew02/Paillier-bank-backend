const { Accounts } = require("../models/Accounts");
const { Key } = require("../models/Keys");

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

async function ArthematicOperation(cipher, cipher2, reciever, user) {
    console.log("Updating Balance", cipher, cipher2);
    console.log("Updating User", user);
    let ciphertotal;
    if (reciever) {
        console.log("add");
        let n = BigInt(user.publicKey.n);
        console.log("ryan n ", n);
        const ciphertotal = (BigInt(cipher) * cipher2) % BigInt(n * n);
        console.log("cipherto ", ciphertotal);
        return ciphertotal;
    }
    else {
        console.log("substract");
        const result = await Key.findOne({
            accountID: user.userID.accountID
        })
        console.log("subkey ", result);
        const n = BigInt(result.publicKey.n);
        ciphertotal = (BigInt(cipher) * modInverse(BigInt(cipher2), BigInt(n * n))) % BigInt(n * n); // for subtraction
        console.log("new balance ", ciphertotal);
        return ciphertotal;
    }
}


async function userBalanceUpdate(user, cipher, reciever) {
    console.log("userBalanceUpdate", user, user.userID.accountID, cipher);
    const result = await Accounts.findOne({
        accountID: user.userID.accountID
    })
    console.log("found user balance", result, result.balance);
    const newBalance = await ArthematicOperation(result.balance, cipher, reciever, user);
    console.log("NEW balance", newBalance);
    await Accounts.findOneAndUpdate({
        accountID: user.userID.accountID
    }, {
        balance: newBalance,
    })
    console.log("Balance Update");
}

module.exports = { userBalanceUpdate }