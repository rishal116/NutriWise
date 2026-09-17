import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;

const getEncryptionKey = (): Buffer => {
  const secret = process.env.INVITE_TOKEN_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("INVITE_TOKEN_ENCRYPTION_KEY is not configured");
  }

  const key = Buffer.from(secret, "hex");

  if (key.length !== 32) {
    throw new Error("INVITE_TOKEN_ENCRYPTION_KEY must be a 32-byte hex value");
  }

  return key;
};

export const encryptInviteToken = (token: string): string => {
  const iv = randomBytes(IV_LENGTH);

  const cipher = createCipheriv(ALGORITHM, getEncryptionKey(), iv);

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("hex"),
    authTag.toString("hex"),
    encrypted.toString("hex"),
  ].join(":");
};

export const decryptInviteToken = (encryptedToken: string): string => {
  const [ivHex, authTagHex, encryptedHex] = encryptedToken.split(":");

  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Invalid encrypted invite token");
  }

  const decipher = createDecipheriv(
    ALGORITHM,
    getEncryptionKey(),
    Buffer.from(ivHex, "hex"),
  );

  decipher.setAuthTag(Buffer.from(authTagHex, "hex"));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex, "hex")),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};
