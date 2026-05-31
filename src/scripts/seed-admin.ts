/**
 * Run once to create the super admin:
 *   npx ts-node --project tsconfig.json src/scripts/seed-admin.ts
 *
 * Or with tsx:
 *   npx tsx src/scripts/seed-admin.ts
 */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI!;
const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL || "admin@feteasy.app";
const ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!";
const ADMIN_NAME = "Super Admin";

async function main() {
  console.log("🔌 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  // Inline schema to avoid circular imports
  const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true, lowercase: true },
    password: String,
    role: { type: String, default: "organizer" },
  }, { timestamps: true });

  const User = mongoose.models.User || mongoose.model("User", UserSchema);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`✅ Admin already exists: ${ADMIN_EMAIL}`);
    await mongoose.disconnect();
    return;
  }

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: "super_admin" });

  console.log(`✅ Super admin created: ${ADMIN_EMAIL}`);
  console.log("   → Change the password in .env.local after first login");
  await mongoose.disconnect();
}

main().catch(console.error);
