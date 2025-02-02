import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function getAdminUser() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" }
  });
  if (!admin) throw new Error("No admin user found");
  return admin;
}

export default getAdminUser;