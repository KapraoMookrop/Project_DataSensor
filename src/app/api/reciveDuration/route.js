import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

client.connect();

// Function to log errors
// function logError(message) {
//     const logFilePath = path.join(process.cwd(), 'log.txt');
//     const currentDate = new Date().toISOString();
//     const logMessage = `[${currentDate}] ERROR: ${message}\n`;
//     fs.appendFileSync(logFilePath, logMessage);
// }

export async function POST(request) {
  try {
    // รับข้อมูลที่ส่งมาใน POST request
    const { light_on_duration } = await request.json();

    // ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (light_on_duration === undefined) {
      throw new Error('Missing data');
    }

    // ดึงวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
    const currentDate = new Date().toISOString().split('T')[0];

    // ค้นหาเรคคอร์ดล่าสุดในฐานข้อมูลที่ตรงกับวันที่ปัจจุบัน
    const findRecordQuery = `
      SELECT *
      FROM "CCW043" 
      WHERE DATE(updated) = $1 
      ORDER BY updated DESC 
      LIMIT 1
    `;
    const findRecordRes = await client.query(findRecordQuery, [currentDate]);

    if (findRecordRes.rows.length > 0) {
      // ถ้ามีเรคคอร์ดในวันนี้ ให้บวกเวลาที่ส่งมาใหม่เข้ากับเวลาที่มีอยู่แล้วในฐานข้อมูล
      const existingDuration = parseInt(findRecordRes.rows[0].neo_pixel_duration);
      const updatedDuration = existingDuration + light_on_duration;

      // อัปเดตเรคคอร์ดเดิม
      const updateQuery = `
        UPDATE "CCW043" 
        SET neo_pixel_duration = $1 
        WHERE id = $2 
        RETURNING *
      `;
      const updateRes = await client.query(updateQuery, [updatedDuration, findRecordRes.rows[0].id]);

      return new Response(JSON.stringify(updateRes.rows[0]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      // ถ้าไม่มีเรคคอร์ดในวันนี้ ให้เพิ่มเรคคอร์ดใหม่
      const insertQuery = `
        INSERT INTO "CCW043" (neo_pixel_duration) 
        VALUES ($1) 
        RETURNING *
      `;
      const insertRes = await client.query(insertQuery, [light_on_duration]);

      return new Response(JSON.stringify(insertRes.rows[0]), {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    // บันทึกข้อผิดพลาดลงใน log.txt
    // logError(error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
