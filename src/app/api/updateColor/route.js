// src/app/api/updateColor/route.js
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
    const { red, green, blue, mode } = body;

    // ตรวจสอบข้อมูลที่ได้รับ
    if (
      typeof red === 'number' && red >= 0 && red <= 255 &&
      typeof green === 'number' && green >= 0 && green <= 255 &&
      typeof blue === 'number' && blue >= 0 && blue <= 255
    ) {
      // อัพเดทข้อมูลในฐานข้อมูล
      const res = await client.query(
        'UPDATE "TR000" SET red = $1, green = $2, blue = $3, mode = $4 WHERE id = $5 RETURNING *',
        [red, green, blue, mode, 1] // ใช้ `1` เป็น ID ของแถวที่ต้องการอัปเดต
      );

      if (res.rowCount > 0) {
        return new Response(JSON.stringify({ success: true, message: 'Color updated successfully' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } else {
        return new Response(JSON.stringify({ success: false, message: 'Failed to update color' }), {
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