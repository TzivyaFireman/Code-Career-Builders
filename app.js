const express = require('express');
const app = express();

let clients = [];

// Helper function to broadcast the current time to all clients
const broadcastTime = () => {
    const time = new Date().toLocaleTimeString();
    clients.forEach(client => {
        client.write(`${time} | `);
    });
};

// Set an interval to broadcast the time every second
setInterval(broadcastTime, 1000);

app.get('/getHour', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    res.write(`${new Date().toLocaleTimeString()} | `);

    clients.push(res);

    req.on('close', () => {
        clients = clients.filter(client => client !== res);
    });
});

app.listen(3002, () => {
    console.log("SSE server running on http://localhost:3002");
});
