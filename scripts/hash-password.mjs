// Generate a bcrypt hash for ADMIN_PASSWORD_HASH.
// Usage: node scripts/hash-password.mjs "your-password"
import bcrypt from "bcryptjs";

const pw = process.argv[2];
if (!pw) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}
const hash = await bcrypt.hash(pw, 10);
const nextEnvHash = hash.replaceAll("$", "\\$");

console.log("Raw bcrypt hash:");
console.log(hash);
console.log("\nNext.js .env value:");
console.log(`ADMIN_PASSWORD_HASH="${nextEnvHash}"`);
