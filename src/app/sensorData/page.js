// src/app/SensorData.js
"use client";

import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function SensorData() {
  const [data, setData] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/getData')
      .then(response => response.json())
      .then(data => setData(data[0])) // Assuming you want the latest record
      .catch(error => setError(error));
  }, []);

  if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
  if (!data || Object.keys(data).length === 0) return <div className="alert alert-info">Loading...</div>;

  const chartData = {
    labels: ['LDR', 'VR', 'Temperature', 'Distance'],
    datasets: [
      {
        label: 'Sensor Data',
        data: [data.ldr, data.vr, data.temp, data.distance],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF5733'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          generateLabels: (chart) => {
            const data = chart.data;
            
            return data.datasets[0].data.map((dataPoint, index) => {
              const label = data.labels[index];
              const color = data.datasets[0].backgroundColor[index];
              return {
                text: `${label}: ${dataPoint}`,
                fillStyle: color,
                strokeStyle: color,
                lineWidth: 2,
                hidden: false,
              };
            });
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return tooltipItem.label + ': ' + tooltipItem.raw;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Sensor Types',
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Values',
        },
      },
    },
  };

  return (
    <div className="container my-4">
      <h1 className="my-4">Dashboard</h1>
      <div className="row">
        <div className="col-md-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Latest Sensor Data</h5>
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SensorData;
