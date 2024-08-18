'use client'

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

    const updateLEDStatus = (status) => {
        fetch('/api/statusLED', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response Data:', data);  // เพิ่มการตรวจสอบข้อมูลที่ได้รับ
            if (data.success) {
                alert(`LED status updated to ${status}`);
            } else {
                alert('Failed to update LED status');
            }
        })
        .catch(error => {
            console.error('Error updating LED status:', error);
            alert('Error updating LED status');
        });
    };
    

    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
    if (data.length === 0) return <div className="alert alert-info">Loading...</div>;

    return (
        <div className="container mb-4">
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
                    <div className="col-12 text-center mt-3">
                        <button className="btn btn-success mx-3" onClick={() => updateLEDStatus('on')}>Turn LED On</button>
                        <button className="btn btn-danger" onClick={() => updateLEDStatus('off')}>Turn LED Off</button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
