// api/connect.js
export default async function handler(req, res) {
    const response = await fetch('http://<PICO-W-IP-ADDRESS>/connect', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });

    if (response.ok) {
        res.status(200).send('Connected successfully');
    } else {
        res.status(500).send('Failed to connect');
    }
}