import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request) {
  try {
    // รับข้อมูลจาก request body
    const body = await request.json();
    let { red, green, blue, mode } = body;
    red = parseInt(red);
    green = parseInt(green);
    blue = parseInt(blue);
    mode = parseInt(mode);

    // ตรวจสอบข้อมูลที่ได้รับ
    if (
      typeof red === 'number' && red >= 0 && red <= 255 &&
      typeof green === 'number' && green >= 0 && green <= 255 &&
      typeof blue === 'number' && blue >= 0 && blue <= 255
    ) {
      // ดึงวันที่ปัจจุบันในรูปแบบที่ตรงกับฐานข้อมูล (เช่น YYYY-MM-DD)
      const currentDate = new Date().toISOString().split('T')[0];

      // อัพเดทข้อมูลในฐานข้อมูลที่มีวันที่ตรงกับวันที่ปัจจุบัน
      const res = await client.query(
        'UPDATE "CCW043" SET red = $1, green = $2, blue = $3, mode = $4 WHERE updated::date = $5::date',
        [red, green, blue, mode, currentDate]
      );

      if (res.rowCount > 0) {
        return new Response(JSON.stringify({ success: true, message: 'Color updated successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ success: false, message: 'No record found for the current date' + currentDate}), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else {
      return new Response(JSON.stringify({ success: false, message: 'Invalid color values' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error updating color:', error);
    return new Response(JSON.stringify({ success: false, message: 'Internal server error', error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
