const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin
  const adminEmail = 'admin@college.edu';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('adminpassword', 10);
    const admin = await prisma.user.create({
      data: {
        name: 'College Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      },
    });
    console.log(`Created default admin user: ${admin.email}`);
  } else {
    console.log(`Admin user ${adminEmail} already exists.`);
  }

  // 2. Create Seat Matrix (Branches)
  const branches = [
    { name: 'Computer Science Engineering', code: 'CSE', seats: 60 },
    { name: 'Electronics & Communication Engineering', code: 'ECE', seats: 60 },
    { name: 'Mechanical Engineering', code: 'ME', seats: 60 },
    { name: 'Civil Engineering', code: 'CE', seats: 60 },
    { name: 'Electrical Engineering', code: 'EE', seats: 60 },
    { name: 'Information Technology', code: 'IT', seats: 60 },
  ];

  for (const branch of branches) {
    const existingBranch = await prisma.seatMatrix.findUnique({
      where: { branchCode: branch.code },
    });

    if (!existingBranch) {
      await prisma.seatMatrix.create({
        data: {
          branchName: branch.name,
          branchCode: branch.code,
          totalSeats: branch.seats,
          filledSeats: 0,
        },
      });
      console.log(`Created branch: ${branch.name} (${branch.code})`);
    } else {
      console.log(`Branch ${branch.code} already exists.`);
    }
  }

  console.log('Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
