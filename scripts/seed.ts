// scripts/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash('your-password', 10)

  await prisma.user.create({
    data: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  console.log("User created.")
}

main()
