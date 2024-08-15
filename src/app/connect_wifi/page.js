'use client';  // เพิ่มบรรทัดนี้

import { useState, useEffect } from 'react';

export default function Home() {
    const [wifiList, setWifiList] = useState([]);
    const [selectedWifi, setSelectedWifi] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    useEffect(() => {
        fetch('http://192.168.4.1/wifi-list')
            .then(response => response.json())
            .then(data => setWifiList(data))
            .catch(error => console.error('Error fetching WiFi list:', error));
    }, []);

    const handleConnect = async () => {
        const response = await fetch('http://192.168.4.1/connect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ssid: selectedWifi, password }),
        });

        const result = await response.json();
        setStatus(result.status);
    };

    return (
        <div>
            <h1>Select WiFi Network</h1>
            <select value={selectedWifi} onChange={(e) => setSelectedWifi(e.target.value)}>
                <option value="">Select a WiFi Network</option>
                {wifiList.map((wifi, index) => (
                    <option key={index} value={wifi.ssid}>
                        {wifi.ssid} ({wifi.rssi} dBm)
                    </option>
                ))}
            </select>

            <input
                type="password"
                placeholder="Enter WiFi Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleConnect}>Connect</button>

            {status && <p>Connection Status: {status}</p>}
        </div>
    );
}
