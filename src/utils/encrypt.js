const crypto = require('crypto');

// Generate key pairs for user A and user B
function generateKeyPair() {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
}

const { publicKey: pk_A, privateKey: sk_A } = generateKeyPair();
const { publicKey: pk_B, privateKey: sk_B } = generateKeyPair();

// Encrypt data with a public key
function encryptData(publicKey, data) {
    const buffer = Buffer.from(data, 'utf8');
    const encrypted = crypto.publicEncrypt(publicKey, buffer);
    return encrypted.toString('base64');
}

// Decrypt data with a private key
function decryptData(privateKey, encryptedData) {
    const buffer = Buffer.from(encryptedData, 'base64');
    const decrypted = crypto.privateDecrypt(privateKey, buffer);
    return decrypted.toString('utf8');
}

// Generate a re-encryption key (for simplicity, we'll just return the private key of user A)
function generateReEncryptionKey(privateKeyA, publicKeyB) {
    // In a real-world scenario, this would involve more complex cryptographic operations
    return privateKeyA;
}

// Re-encrypt data (for simplicity, we'll just re-encrypt the data with the public key of user B)
function reEncryption(reEncryptionKey, encryptedData) {
    const decryptedData = decryptData(reEncryptionKey, encryptedData);
    return encryptData(pk_B, decryptedData);
}

// Example usage
let obj = encryptData(pk_A, "test data");
console.log("Encrypted Data:", obj);

let rk = generateReEncryptionKey(sk_A, pk_B);
let reEncryptedData = reEncryption(rk, obj);
console.log("Re-Encrypted Data:", reEncryptedData);

let decryptDataResult = decryptData(sk_B, reEncryptedData);
console.log("Decrypted Data:", decryptDataResult);