// src/app/api/getData/route.js
import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function GET() {
  try {
    const res = await client.query('SELECT * FROM "CCW043" ORDER BY "updated" DESC LIMIT 1');
    return new Response(JSON.stringify(res.rows), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
  } catch (error) {

    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
