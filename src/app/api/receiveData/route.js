// src/app/api/receiveData/route.js
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
    const { ldr, vr, temp, distance } = await request.json();

    // ตรวจสอบว่ามีข้อมูลครบถ้วน
    if (ldr === undefined || vr === undefined || temp === undefined || distance === undefined) {
      throw new Error('Missing data');
    }

    // บันทึกข้อมูลลงในฐานข้อมูล
    const res = await client.query(
      'INSERT INTO "TR000" (ldr, vr, temp, distance) VALUES ($1, $2, $3, $4) RETURNING *',
      [ldr, vr, temp, distance]
    );

    return new Response(JSON.stringify(res.rows[0]), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // บันทึกข้อผิดพลาดลงใน log.txt
    // logError(error.message);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
