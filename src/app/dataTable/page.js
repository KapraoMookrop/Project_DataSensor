"use client";

import React, { useEffect, useState } from 'react';

function dataTable() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const maxValue = 100;
  const minValue = 0;

  useEffect(() => {
      fetch('/api/getAllData')
          .then(response => response.json())
          .then(data => setData(data))
          .catch(error => setError(error));
  }, []);

  if (error) return <div className="alert alert-danger container">Error: {error.message}</div>;
  if (data.length === 0) return <div className="alert alert-info container">Loading...</div>;

  return (
      <div className="container mt-5">
        <h1>Sensor Data</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>LDR</th>
              <th>VR</th>
              <th>Temperature</th>
              <th>Distance</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.ldr}</td>
                <td>{row.vr}</td>
                <td>{row.temp}</td>
                <td>{row.distance}</td>
                <td>{row.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}

export default dataTable;