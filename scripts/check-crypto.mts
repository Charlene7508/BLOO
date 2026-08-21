import { deriveKeyEncryptionKey, generateSalt, generateDataKey, encryptJson, decryptJson, encrypt, decrypt } from "@/lib/crypto";

const salt = generateSalt();
const t0 = Date.now();
const kek = await deriveKeyEncryptionKey("mon mot de passe maître", salt);
console.log(`KEK dérivée en ${Date.now() - t0} ms, ${kek.length} octets`);

const dek = generateDataKey();
const wrapped = encrypt(kek, dek);
const unwrapped = decrypt(await deriveKeyEncryptionKey("mon mot de passe maître", salt), wrapped);
console.log("clé de données retrouvée :", unwrapped.equals(dek));

const blob = encryptJson(dek, { hemoglobine: 13.2, note: "confidentiel" });
console.log("aucune fuite en clair :", !blob.toString("utf8").includes("hemoglobine"));
console.log("déchiffré :", decryptJson(dek, blob));

try {
  decrypt(await deriveKeyEncryptionKey("mauvais mot de passe", salt), wrapped);
  console.log("ÉCHEC : un mauvais mot de passe a été accepté");
} catch {
  console.log("mauvais mot de passe rejeté : oui");
}
