const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function initSupabase() {
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error('❌ Error: SUPABASE_DB_URL or DATABASE_URL environment variable is missing in server/.env');
    console.log('\n💡 Tip: Get your Connection String from Supabase:');
    console.log('   Supabase Dashboard -> Project Settings -> Database -> Connection String (URI)\n');
    process.exit(1);
  }

  try {
    const { Client } = require('pg');
    const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });

    console.log('🔄 Connecting to Supabase PostgreSQL database...');
    await client.connect();

    const sqlPath = path.join(__dirname, '../config/supabase_schema.sql');
    const sqlScript = fs.readFileSync(sqlPath, 'utf8');

    console.log('⚡ Executing Supabase schema script...');
    await client.query(sqlScript);

    console.log('✅ Supabase database tables created successfully!');
    console.log('   - users');
    console.log('   - courses');
    console.log('   - lectures');
    console.log('   - course_enrollments');
    console.log('   - progress\n');

    await client.end();
  } catch (error) {
    console.error('❌ Failed to initialize Supabase database:', error.message);
  }
}

if (require.main === module) {
  initSupabase();
}

module.exports = initSupabase;
