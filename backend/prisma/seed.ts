import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash("Admin@1234", 10);

  await prisma.user.upsert({
    where: { email: "admin@taskmanager.com" },

    update: {
      role: "admin",          // 🔥 force admin role always
      password: hashed,       // optional: reset password if needed
      isActive: true,
      isVoid: false,
    },

    create: {
      name: "Admin",
      email: "admin@taskmanager.com",
      phone: "9012345678",
      address: "System",
      gender: "female",
      password: hashed,
      role: "admin",
      isActive: true,
      isVoid: false,
    },
  });

  console.log("✅ Admin ensured: admin@taskmanager.com / Admin@1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());