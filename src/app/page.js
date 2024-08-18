// src/app/page.js
import SensorData from './sensorData/page'; // ปรับเส้นทางให้ถูกต้องตามที่ตั้งอยู่
import Dashboard from './dashboard/page';

export default function Page() {
  return (
    <div className="container">
        <Dashboard />
        <SensorData />
    </div>
  );
}
