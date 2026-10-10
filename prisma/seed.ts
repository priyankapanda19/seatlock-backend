import "dotenv/config";
import bcrypt from "bcrypt";
import prisma from "../src/lib/prisma";

const main = async () => {
  const email = "admin@seatlock.com";
  const password = "Admin@12345";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      role: "ADMIN",
      isActive: true,
    },
    create: {
      name: "SeatLock Admin",
      email,
      phone: "9999999999",
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log("Demo admin created successfully");
  console.log({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    phone: admin.phone,
    role: admin.role,
  });
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });