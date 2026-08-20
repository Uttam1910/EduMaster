const prisma = require('./prismaClient');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Supabase PostgreSQL connected successfully via Prisma');
  } catch (err) {
    console.error('❌ Supabase PostgreSQL connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;