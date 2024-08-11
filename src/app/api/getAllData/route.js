import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

function convertToThailandTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString('th-TH', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false  // ใช้รูปแบบ 24 ชั่วโมง
  });
}

export async function GET() {
  try {
    const res = await client.query('SELECT * FROM sensor_data');
    
    // แปลง timestamp ในแต่ละ row ก่อนส่งไป
    const dataWithConvertedTime = res.rows.map(row => ({
      ...row,
      updated: convertToThailandTime(row.updated)
    }));

    return new Response(JSON.stringify(dataWithConvertedTime), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
