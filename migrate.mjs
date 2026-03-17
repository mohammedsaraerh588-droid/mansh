import pg from 'pg';
import fs from 'fs';

const connectionString = "postgresql://postgres:[0798117567gghhmm]@db.gfuyriwtcyyvbrzlrhwp.supabase.co:5432/postgres";

const client = new pg.Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('Connecting to Supabase Database...');
    await client.connect();
    console.log('Connected! Reading SQL schema...');
    
    // Read the schema file
    const sql = fs.readFileSync('supabase-schema.sql', 'utf8');
    
    console.log('Executing SQL schema... This might take a few seconds.');
    // Execute the SQL
    await client.query(sql);
    
    console.log('✅ Database schema applied successfully!');
  } catch (err) {
    console.error('❌ Error executing schema:', err);
  } finally {
    await client.end();
  }
}

run();
