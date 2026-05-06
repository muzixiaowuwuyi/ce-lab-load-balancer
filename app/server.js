/**
 * AWS Load Balanced Application
 * A simple Node.js server to demonstrate ALB routing and health checks.
 */

const http = require('http');
const os = require('os');

// Retrieve environment variables passed from the User Data script
const INSTANCE_ID = process.env.INSTANCE_ID || 'unknown';
const AZ = process.env.AZ || 'unknown';

const server = http.createServer((req, res) => {
    // 1. Health check endpoint for ALB
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'healthy',
            instance: INSTANCE_ID,
            az: AZ,
            uptime: process.uptime()
        }));
        return;
    }

    // 2. Main landing page showing instance metadata
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Load Balanced App</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f4f7f6; }
            .container { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); display: inline-block; }
            h1 { color: #232f3e; }
            .instance { color: #007bff; font-size: 24px; font-weight: bold; margin: 10px 0; }
            .az { color: #28a745; font-size: 18px; margin: 5px 0; }
            .footer { margin-top: 20px; color: #666; font-size: 14px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🚀 Cloud Engineering Bootcamp</h1>
            <h2>Load Balanced Application</h2>
            <hr>
            <p class="instance">Instance ID: ${INSTANCE_ID}</p>
            <p class="az">Availability Zone: ${AZ}</p>
            <p><strong>Hostname:</strong> ${os.hostname()}</p>
            <div class="footer">
                <p>This request was handled by a healthy backend instance.</p>
            </div>
        </div>
    </body>
    </html>
    `);
});

// Port 80 requires sudo/root privileges
const PORT = 80;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Instance: ${INSTANCE_ID}, AZ: ${AZ}`);
});