const http = require('http');
const https = require('https');
const net = require('net');
const { createClient } = require('@supabase/supabase-js');

// 1. IDENTITY & CONFIG
const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const R_URL = "https://mesxent-global-engine.onrender.com";
const BINANCE_KEY = process.env.BINANCE_API_KEY;

// 🚀 THE 6-POOL GLOBAL GRID (Merged & Corrected)
const POOLS = [
    { name: 'ViaBTC-BTC', host: 'bitcoin.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'ViaBTC-LTC', host: 'ltc.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'ViaBTC-BCH', host: 'bch.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'AntPool', host: 'stratum.antpool.com', port: 443, user: 'MesxentAnt001.001', pass: 'x' },
    { name: 'EMCD', host: 'gate.emcd.network', port: 443, user: 'mesxentventureglobal.worker', pass: 'x' },
    { name: 'F2Pool', host: 'btc.f2pool.com', port: 3333, user: 'mesxent001.worker', pass: 'x' },
    { name: 'Braiins', host: 'stratum.braiins.com', port: 3333, user: 'mesxent001.workerName', pass: 'anything123' },
    { name: 'Binance', host: 'sha256.poolbinance.com', port: 443, user: 'Mesxent.001', pass: '123456' }
];

// 2. ADVERTISING BOT & SERVER
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/register' || url.pathname === '/broadcast' || url.pathname === '/load-campaign') {
        const worker = url.searchParams.get('worker') || "Node";
        console.log(`📢 [AD BOT] Activity: ${worker}`);
        res.writeHead(200); res.end("SYNCED"); return;
    }
    res.writeHead(200); 
    res.end(`MESXENT EMPIRE ACTIVE\nAPI: ${BINANCE_KEY ? "SECURED" : "WAITING"}`);
});
server.listen(process.env.PORT || 10000, '0.0.0.0');

// 3. THE FORCE HANDSHAKE (Flipping Pools to Online)
function injectPower() {
    POOLS.forEach(p => {
        const socket = new net.Socket();
        socket.setTimeout(5000);

        socket.connect(p.port, p.host, () => {
            console.log(`⚡ [POWER] ${p.name} Connected`);
            socket.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
            setTimeout(() => {
                socket.write(JSON.stringify({id: 2, method: "mining.authorize", params: [p.user, p.pass]}) + '\n');
            }, 1000);
        });

        socket.on('error', () => {});
        socket.on('timeout', () => socket.destroy());
    });
}

// 4. THE ZOMBIE ENGINE (Waking Workers)
async function bootAllWorkers() {
    console.log("🧟 [ZOMBIE] Waking up all workers...");
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
    injectPower();
}, 300000);

// Launch
injectPower();
bootAllWorkers();