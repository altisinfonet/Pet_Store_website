import CryptoJS from "crypto-js";

/**
 * Encrypts the given payload before sending to an API.
 * @param data - The payload to encrypt (object).
 * @returns Encrypted string or null if encryption fails.
 */
export const encryptPayload = (data: object): string | null => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    if (!secretKey) {
        // console.error("Encryption key is missing!");
        return null;
    }

    try {
        const jsonString = JSON.stringify({ data }); // Wrap data inside an object
        return CryptoJS.AES.encrypt(jsonString, secretKey).toString();
    } catch (error) {
        console.error("Encryption failed:", error);
        return null;
    }
};

/**
 * Decrypts an encrypted payload received from the API.
 * @param encryptedText - The encrypted string.
 * @returns Decrypted JSON object or null if decryption fails.
 */
export const decryptPayload = (encryptedText: string): object | null => {
    const secretKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

    if (!secretKey) {
        // console.error("Decryption key is missing!");
        return null;
    }

    try {
        const bytes = CryptoJS.AES.decrypt(encryptedText, secretKey);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decryptedData).data;
    } catch (error) {
        console.error("Decryption failed:", error);
        return null;
    }
};

