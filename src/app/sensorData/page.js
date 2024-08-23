// src/app/SensorData.js
"use client";

import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement
);

function SensorData() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/getAllData')
      .then(response => response.json())
      .then(data => {
        console.log(data); // Log the received data to check its structure
        setData(data);
      })
      .catch(error => setError(error));
  });

  // Prepare data for the chart
  const chartData = {
    labels: data.map(record => {
      const [datePart, timePart] = record.updated.split(' '); // แยกวันที่และเวลา
      const [day, month, year] = datePart.split('/'); // แยกวัน/เดือน/ปี

      // สร้างรูปแบบใหม่ที่ JavaScript เข้าใจ (MM/DD/YYYY HH:mm:ss)
      const formattedDate = `${month}/${day}/${year} ${timePart}`;
      const date = new Date(formattedDate);
      
      // ตรวจสอบว่าค่าวันที่ถูกต้องหรือไม่
      if (isNaN(date.getTime())) {
        console.error(`Invalid date format for record: ${record.updated}`);
        return "Invalid Date"; // หรือข้อความแทนที่ที่ต้องการ
      }

      return `${date.toLocaleDateString()}`;
    }),
    datasets: [
      {
        label: 'NeoPixel usage',
        data: data.map(record => record.neo_pixel_duration), // Adjust the key to match your data structure
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1
      }
    ]
  };

  // Configure chart options
  const options = {
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date and Time'
        }
      },
      y: {
        title: {
          display: true,
          text: 'NeoPixel usage'
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  return (
    <div>
      {error ? (
        <div>Error: {error.message}</div>
      ) : (
        <Line data={chartData} options={options} />
      )}
    </div>
  );
}

export default SensorData;
