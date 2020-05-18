/**
 * Created by Jacob Strieb
 * May 2020
 */



/*******************************************************************************
 * Global Variables
 ******************************************************************************/

var LATEST_API_VERSION = "0.0.1";

var apiVersions = {};



/*******************************************************************************
 * API Version 0.0.1 (Latest)
 ******************************************************************************/

apiVersions["0.0.1"] = {

  // Static salt and initialization vector for shorter, less secure links
  salt: Uint8Array.from([236, 231, 167, 249, 207, 95, 201, 235, 164, 98, 246,
            26, 176, 174, 72, 249]),

  iv: Uint8Array.from([255, 237, 148, 105, 6, 255, 123, 202, 115, 130, 16,
            116]),


  // Generate random salt and initialization vectors
  randomSalt: async function() {
    return await window.crypto.getRandomValues(new Uint8Array(16));
  },

  randomIv: async function() {
    return await window.crypto.getRandomValues(new Uint8Array(12));
  },


  // Import the raw, plain-text password and derive a key using a SHA-256 hash
  // and PBKDF2. Use the static salt for this version if one has not been given
  deriveKey: async function(password, salt=null) {
    let rawKey = await window.crypto.subtle.importKey(
        "raw",
        b64.asciiToBinary(password),
        { name: "PBKDF2" },
        false,
        [ "deriveBits", "deriveKey" ]
    );
    return await window.crypto.subtle.deriveKey(
        {
          name: "PBKDF2",
          salt: salt == null ? this.salt : salt,
          iterations: 100000,
          hash: "SHA-256"
        },
        rawKey,
        {
          name: "AES-GCM",
          length: 256
        },
        true,
        [ "encrypt", "decrypt" ]
    );
  },


  // Encrypt the text using AES-GCM with a key derived from the password. Takes
  // in strings for text and password, as well as optional salt and iv. Uses the
  // static iv for this version if one is not given.
  encrypt: async function(text, password, salt=null, iv=null) {
    let key = await this.deriveKey(password, salt=salt);
    let encryptedBinary = await window.crypto.subtle.encrypt(
        {
          name: "AES-GCM",
          iv: iv == null ? this.iv : iv
        },
        key,
        b64.asciiToBinary(text)
    );
    return encryptedBinary;
  },


  // Decrypt the text using AES-GCM with a key derived from the password. Takes
  // in text as an ArrayBuffer and a string password, as well as optional salt
  // and iv. Uses the static iv for this version if one is not given.
  decrypt: async function(text, password, salt=null, iv=null) {
    let key = await this.deriveKey(password, salt=salt);
    let decryptedBinary = await window.crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: iv == null ? this.iv : iv
        },
        key,
        new Uint8Array(text)
    );
    return b64.binaryToAscii(decryptedBinary);
  }

}
