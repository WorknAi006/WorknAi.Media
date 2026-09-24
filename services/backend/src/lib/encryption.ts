import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes recommended for GCM
const PREFIX = "enc:";

/**
 * Derives a consistent 32-byte encryption key using SHA-256
 */
const getEncryptionKey = (): Buffer => {
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.JWT_SECRET ||
    "worknai_media_secure_token_secret_key_2026";
  return crypto.createHash("sha256").update(secret).digest();
};

/**
 * Encrypt sensitive access token before saving to database
 */
export const encryptToken = (plainText: string): string => {
  if (!plainText || typeof plainText !== "string") {
    return plainText;
  }

  // If already encrypted, return as is
  if (plainText.startsWith(PREFIX)) {
    return plainText;
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");

    const authTag = cipher.getAuthTag().toString("hex");

    // Format: enc:iv:authTag:ciphertext
    return `${PREFIX}${iv.toString("hex")}:${authTag}:${encrypted}`;
  } catch (err: any) {
    console.error("❌ [Encryption] Failed to encrypt token:", err.message);
    throw new Error("Token encryption failed");
  }
};

/**
 * Decrypt access token from database.
 * If token is not encrypted (e.g. legacy token), returns as is for full backward compatibility.
 */
export const decryptToken = (cipherOrPlainText: string): string => {
  if (!cipherOrPlainText || typeof cipherOrPlainText !== "string") {
    return cipherOrPlainText;
  }

  // Not an encrypted string -> return raw token (legacy backwards compatibility)
  if (!cipherOrPlainText.startsWith(PREFIX)) {
    return cipherOrPlainText;
  }

  try {
    const parts = cipherOrPlainText.split(":");
    if (parts.length !== 4) {
      // Malformed prefix, fallback to raw
      return cipherOrPlainText;
    }

    const [, ivHex, tagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (err: any) {
    console.warn("⚠️ [Encryption] Failed to decrypt token, falling back to raw value:", err.message);
    return cipherOrPlainText;
  }
};
