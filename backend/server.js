const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        // STRICT SECURITY: Only your domain can talk to this server
        origin: ["https://www.designedbygreg.com", "https://designedbygreg.com", "http://localhost:5173", "http://localhost:4173"],
        methods: ["GET", "POST"]
    }
});
const geoip = require('geoip-lite');
const fs = require('fs');

// --- PERSISTENCE (Database) ---
const DB_FILE = 'traffic_db.json';
let stats = { total: 0, history: [] };

// Load data on startup so counts persist
if (fs.existsSync(DB_FILE)) {
    try { stats = JSON.parse(fs.readFileSync(DB_FILE)); } 
    catch(e) { console.log('Starting fresh DB'); }
}

function saveDB() {
    fs.writeFileSync(DB_FILE, JSON.stringify(stats));
}

// Health check for the hosting provider
app.get('/', (req, res) => res.send('Greg\'s Traffic Tower is Online'));

io.on('connection', (socket) => {
    
    // 1. RECEIVE HIT FROM MAIN SITE
    socket.on('visitor_hit', () => {
        // Vercel passes the real IP in this header
        let ip = socket.handshake.headers['x-forwarded-for'] || socket.request.connection.remoteAddress;
        // Clean IP if multiple proxies exist
        if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();

        // Localhost fallback for testing
        if (ip === '::1' || ip === '127.0.0.1') {
            // Random IP for testing if local
            ip = '8.8.8.8'; 
        }

        const geo = geoip.lookup(ip);
        
        // Only count if we can locate them (filters bots) - OR if we want to log everything, remove the if check.
        // Keeping user's logic:
        if (geo) {
            const hit = {
                city: geo.city,
                country: geo.country,
                lat: geo.ll[0],
                lon: geo.ll[1],
                time: new Date().toLocaleTimeString('en-US', { timeZone: 'America/New_York' })
            };

            stats.total++;
            stats.history.unshift(hit);
            if (stats.history.length > 200) stats.history.pop();
            saveDB();

            // Tell Admin Panel to update
            io.emit('admin_update', { 
                total: stats.total, 
                new_hit: hit 
            });
        }
    });

    // 2. ADMIN CONNECTS
    socket.on('admin_join', () => {
        socket.emit('init_data', stats);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => console.log(`Tower running on port ${PORT}`));