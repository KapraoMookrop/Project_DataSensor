"use client";

import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);

    const maxValue = 100;
    const minValue = 0;

    useEffect(() => {
        fetch('/api/getData')
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => setError(error));
    }, []);

    useEffect(() => {
        data.forEach((item, index) => {
            rotateWheel(item.ldr, `ldrWheel${index}`);
            rotateWheel(item.vr, `vrWheel${index}`);
            rotateWheel(item.temp, `tempWheel${index}`);
            rotateWheel(item.distance, `distanceWheel${index}`);
        });
    }, [data]);

    function rotateWheel(value, elementId) {
        if (value < minValue) {
            return false;
        }
        const element = document.getElementById(elementId);
        if (element) {
            const percentage = (value / maxValue) * 180 + 180;
            element.style.transform = `rotate(${percentage}deg)`;
        }
    }

    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
    if (data.length === 0) return <div className="alert alert-info">Loading...</div>;

    return (
        <div className="container">
            {data.map((item, index) => (
                <div key={index} className="sensor-data-row row">
                    <div className="progress-wheel-wrapper col-3">
                        <p className='fs-4 text-center'>LDR(Lux)</p>
                        <div className="pw-body">
                            <div className="pw-circle" id={`ldrWheel${index}`}></div>
                            <div className="pw-circle-overlay">
                                <span className="pw-value-label">{item.ldr}K</span>
                            </div>
                        </div>
                    </div>
                    <div className="progress-wheel-wrapper col-3">
                        <p className='fs-4 text-center'>Variable Resistor(Volt)</p>
                        <div className="pw-body">
                            <div className="pw-circle" id={`vrWheel${index}`}></div>
                            <div className="pw-circle-overlay">
                                <span className="pw-value-label">{item.vr}</span>
                            </div>
                        </div>
                    </div>
                    <div className="progress-wheel-wrapper col-3">
                        <p className='fs-4 text-center'>Temperature(°C)</p>
                        <div className="pw-body">
                            <div className="pw-circle" id={`tempWheel${index}`}></div>
                            <div className="pw-circle-overlay">
                                <span className="pw-value-label">{item.temp}</span>
                            </div>
                        </div>
                    </div>
                    <div className="progress-wheel-wrapper col-3">
                        <p className='fs-4 text-center'>Ultra Sonic(CM.)</p>
                        <div className="pw-body">
                            <div className="pw-circle" id={`distanceWheel${index}`}></div>
                            <div className="pw-circle-overlay">
                                <span className="pw-value-label">{item.distance}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
