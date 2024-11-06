import crypto from 'crypto';

import { NextResponse, NextRequest } from "next/server";


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

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request) {

    const body = await request.json();
    const { url } = body;
    let obj = encryptData(pk_B, url);
    console.log("Encrypted Data:", obj);
    return NextResponse.json(obj, { status: 200 });
}
