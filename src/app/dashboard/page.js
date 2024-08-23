'use client'

import React, { useEffect, useState } from 'react';

function Dashboard() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [red, setRed] = useState(0);
    const [green, setGreen] = useState(0);
    const [blue, setBlue] = useState(0);
    const [mode, setMode] = useState('1');

    const maxValue = 100;
    const minValue = 0;

    useEffect(() => {
        // Fetch data and initial color settings from the database
        fetch('/api/getData')
            .then(response => response.json())
            .then(data => {
                setData(data);

                // Assuming the color and mode settings are part of the data
                if (data.length > 0) {
                    const { red, green, blue, mode } = data[0]; // Adjust the index or structure as needed
                    setRed(red || 0);
                    setGreen(green || 0);
                    setBlue(blue || 0);
                    setMode(mode || '1');
                }
            })
            .catch(error => setError(error));
    }, []);

    useEffect(() => {
        data.forEach((item, index) => {
            rotateWheel(item.neo_pixel_duration, `ledDuration${index}`);
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

    const updateLEDStatus = (status, mode) => {
        fetch('/api/statusLED', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status, mode }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Response Data:', data);  // เพิ่มการตรวจสอบข้อมูลที่ได้รับ
            if (data.success) {
                alert(`LED status updated to ${status} ${data.message}`);
            } else {
                alert('Failed to update LED status');
            }
        })
        .catch(error => {
            console.error('Error updating LED status:', error);
            alert('Error updating LED status');
        });
    };
    
    const updateColor = () => {
        fetch('/api/updateColor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ red, green, blue, mode }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`${data.message}`);
            } else {
                alert('Failed to update color');
            }
        })
        .catch(error => {
            console.error('Error updating color:', error);
            alert('Error updating color');
        });
    };

    if (error) return <div className="alert alert-danger">Error: {error.message}</div>;
    if (data.length === 0) return <div className="alert alert-info">Loading...</div>;

    return (
        <div className="container mb-4">
            {data.map((item, index) => (
                <div key={index} className="sensor-data-row row align-items-center">
                    <div className="progress-wheel-wrapper col-3">
                        <p className='fs-4 text-center'>NeoPixel usage</p>
                        <div className="pw-body">
                            <div className="pw-circle" id={`ledDuration${index}`}></div>
                            <div className="pw-circle-overlay">
                                <span className="pw-value-label">{item.neo_pixel_duration} s/day</span>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 text-center">
                        <button className="btn btn-success w-100 my-2 mt-5" onClick={() => updateLEDStatus('on')}>Turn LED On</button>
                        <button className="btn btn-danger w-100 my-2" onClick={() => updateLEDStatus('off')}>Turn LED Off</button>
                    </div>
                    <div className="col-2 text-center">
                        <div className="form-group m-0 p-0 text-center">
                            <label htmlFor="redRange me-2">Red: {red}</label><br></br>
                            <input
                                type="range"
                                id="redRange"
                                className="form-range"
                                min="0"
                                max="255"
                                value={red}
                                onChange={(e) => setRed(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-group m-0 p-0 text-center">
                            <label htmlFor="greenRange me-2">Green: {green}</label>
                            <input
                                type="range"
                                id="greenRange"
                                className="form-range"
                                min="0"
                                max="255"
                                value={green}
                                onChange={(e) => setGreen(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="col-2 text-center">
                        <div className="form-group m-0 p-0 text-center">
                            <label htmlFor="blueRange me-2">Blue: {blue}</label><br></br>
                            <input
                                type="range"
                                id="blueRange"
                                className="form-range"
                                min="0"
                                max="255"
                                value={blue}
                                onChange={(e) => setBlue(Number(e.target.value))}
                            />
                        </div>
                        <div className="form-group  m-0 p-0 text-center">
                            <label htmlFor="modeSelect" >Mode</label><br></br>
                            <select
                                id="modeSelect"
                                className="form-select bg-light text-dark w-75 rounded-2"
                                aria-label="Default select example"
                                value={mode}
                                onChange={(e) => setMode(e.target.value)}
                            >
                                <option value="1">Static Color</option>
                                <option value="2">Breathing Effect</option>
                                <option value="3">Chase Back and Forth</option>
                            </select>
                        </div>
                    </div>
                    <div className='col-2 text-center'>
                    <div className="text-center">
                            <button className="btn btn-primary" onClick={updateColor}>Update Neopixel</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
