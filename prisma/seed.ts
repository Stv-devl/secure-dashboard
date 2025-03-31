import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'jane@example.com',
      name: 'Jane Doe',
      profile: {
        create: {
          firstname: 'Jane',
          lastname: 'Doe',
          subscription: 'premium',
        },
      },
      credentials: {
        create: {
          password: 'password123',
        },
      },
    },
  });

  console.log('Seeded user:', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
