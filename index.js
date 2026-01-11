const http = require('http');
const https = require('https');
const net = require('net');
const { createClient } = require('@supabase/supabase-js');

// 1. IDENTITY
const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const R_URL = "https://mesxent-global-engine.onrender.com";

// 🚀 STABILIZED POOLS (Using Port 443 for maximum bypass)
const POOLS = [
    { name: 'BTC', host: 'bitcoin.viabtc.com', port: 443 },
    { name: 'BCH', host: 'bch.viabtc.com', port: 443 }, 
    { name: 'LTC', host: 'ltc.viabtc.com', port: 443 }
];

// 2. ADVERTISING BOT & SERVER
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/register' || url.pathname === '/broadcast') {
        const worker = url.searchParams.get('worker') || "Node";
        console.log(`📢 [AD BOT] Activity: ${worker}`);
        res.writeHead(200); res.end("SYNCED"); return;
    }
    res.writeHead(200); res.end("MESXENT ACTIVE");
});
server.listen(process.env.PORT || 10000, '0.0.0.0');

// 3. THE FORCE HANDSHAKE (Flipping ViaBTC to Online)
function injectPower() {
    POOLS.forEach(p => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.connect(p.port, p.host, () => {
            console.log(`⚡ [POWER] ${p.name} Connected`);
            // THE TRINITY COMMANDS TO SHOW ONLINE
            socket.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
            setTimeout(() => {
                socket.write(JSON.stringify({id: 2, method: "mining.authorize", params: [`${VIA_BTC_USER}.001`, "x"]}) + '\n');
            }, 1000);
        });

        socket.on('error', (e) => console.log(`[!] ${p.name} Error`));
        socket.on('timeout', () => socket.destroy());
    });
}

// 4. THE ZOMBIE ENGINE (Waking Workers)
async function bootAllWorkers() {
    console.log("🧟 [ZOMBIE] Waking up all workers on the pool...");
    const { data: users } = await supabase.from('workers').select('user_id');
    if (users) {
        users.forEach(u => {
            const s = new net.Socket();
            s.connect(443, 'bitcoin.viabtc.com', () => {
                s.write(JSON.stringify({id:4, method:"mining.authorize", params:[`${VIA_BTC_USER}.u${u.user_id}`,"x"]}) + '\n');
            });
            s.on('error', () => {});
        });
    }
}

// 5. THE HAMMER (Fixed Protocol)
setInterval(() => {
    https.get(R_URL, (res) => { console.log(`🔨 [HAMMER] ${res.statusCode}`); }).on('error', () => {});
    injectPower(); // Keep pushing the pool status
}, 300000);

// Launch
injectPower();
bootAllWorkers();