// api/wifi-list.js
export default async function handler(req, res) {
    const response = await fetch('http://192.168.4.1/wifi-list');
    const networks = await response.json();
    res.status(200).json(networks);
}