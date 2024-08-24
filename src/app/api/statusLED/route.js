// src/app/api/statusLED/route.js
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

export async function POST(request) {
  try {
      const { status } = await request.json();
      if (status !== 'on' && status !== 'off') {
          throw new Error('Invalid status');
      }

      const res = await client.query(
          'UPDATE "CCW043" SET status_led = $1',
          [status] // ใช้ `1` เป็น ID ของแถวที่ต้องการอัปเดต หากมีหลายแถวให้ปรับเป็น ID ที่ต้องการ
      );

      if (res.rowCount === 0) {
          throw new Error('No rows updated');
      }

      return new Response(JSON.stringify({ success: true, message: "updated" }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
      });
  } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
      });
  }
}

export async function GET() {
  try {
    // ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // ดึงข้อมูลสถานะปัจจุบันจากฐานข้อมูล โดยใช้วันที่ปัจจุบันในการคิวรี
    const res = await client.query(
      'SELECT status_led, red, green, blue, mode FROM "CCW043" WHERE updated::date = $1::date',
      [currentDate]
    );

    if (res.rowCount === 0) {
      throw new Error('No records found for the current date');
    }

    return new Response(JSON.stringify(res.rows[0]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching status:', error);

    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

