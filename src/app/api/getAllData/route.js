import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

function convertToThailandTime(timestamp) {
  const date = new Date(timestamp);
  
  // Convert the time to Thailand timezone (UTC+7)
  const options = { 
    timeZone: 'Asia/Bangkok', 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit', 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  };
  
  // แปลงวันที่และเวลาให้เป็นฟอร์แมต 'YYYY-MM-DD HH:MM:SS'
  const formattedDate = date.toLocaleString('en-GB', options).replace(',', '');
  return formattedDate;
}

export async function GET() {
  try {
    const res = await client.query('SELECT * FROM "CCW043" FOR UPDATE');
    
    // แปลง timestamp ในแต่ละ row ก่อนส่งไป
    const dataWithConvertedTime = res.rows.map(row => ({
      ...row,
      updated: convertToThailandTime(row.updated)  // แปลงเวลา updated เป็นเวลาไทย
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
