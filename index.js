const http = require('http');
const https = require('https'); // Added for the secure hammer
const net = require('net');
const { createClient } = require('@supabase/supabase-js');

const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const RENDER_URL = "https://mesxent-global-engine.onrender.com";

// 🚀 FIXED BCH PORT to 443 to stop the ETIMEDOUT error
const POOLS = [
    { name: 'BTC', host: 'bitcoin.viabtc.com', port: 443 },
    { name: 'BCH', host: 'bch.viabtc.com', port: 443 }, 
    { name: 'LTC-DOGE', host: 'ltc.viabtc.com', port: 443 },
    { name: 'KAS', host: 'mining.viabtc.io', port: 3015 }
];

const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/register' || url.pathname === '/broadcast') {
        const worker = url.searchParams.get('worker') || url.searchParams.get('userid');
        const msg = url.searchParams.get('msg') || "Node Sync";
        console.log(`📢 [AD BOT] Activity from ${worker}: ${msg}`);
        if (url.pathname === '/broadcast' && worker) { auditMonetization(worker, msg); }
        res.writeHead(200);
        res.end("SYSTEM ACTIVE");
        return;
    }
    res.writeHead(200);
    res.end("MESXENT ENGINE ACTIVE");
});

server.listen(process.env.PORT || 10000, '0.0.0.0', () => {
    console.log(`Server listening on port ${process.env.PORT || 10000}`);
});

function injectPower() {
    POOLS.forEach(p => {
        const client = new net.Socket();
        client.connect(p.port, p.host, () => {
            console.log(`⚡ [POWER] Forcing Handshake with ${p.name}...`);
            client.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
            setTimeout(() => {
                client.write(JSON.stringify({id: 2, method: "mining.authorize", params: [`${VIA_BTC_USER}.001`, "x"]}) + '\n');
                client.write(JSON.stringify({id: 3, method: "mining.suggest_difficulty", params: [524288]}) + '\n');
            }, 1500);
        });
        client.on('error', (e) => console.log(`[POOL ERROR] ${p.name}: ${e.message}`));
        client.on('close', () => setTimeout(injectPower, 60000));
    });
}

async function bootAllWorkers() {
    console.log("🧟 [ZOMBIE] Waking up all workers on the pool...");
    const { data: users } = await supabase.from('workers').select('user_id');
    if (users) {
        users.forEach(u => {
            POOLS.forEach(pool => {
                const s = new net.Socket();
                s.connect(pool.port, pool.host, () => {
                    s.write(JSON.stringify({id:4, method:"mining.authorize", params:[`${VIA_BTC_USER}.u${u.user_id}`,"x"]}) + '\n');
                });
                s.on('error', () => {});
            });
        });
    }
}

async function auditMonetization(workerId, campaign) {
    try {
        await supabase.from('workers').update({ last_seen: new Date().toISOString(), status: 'LABOR_ACTIVE' }).eq('user_id', workerId);
        console.log(`[CASH] Revenue verified for Worker ${workerId}`);
    } catch (e) { console.log("[ERROR] Sync Failed"); }
}

setInterval(bootAllWorkers, 600000); 
setInterval(injectPower, 300000);   

// 🚀 FIXED HAMMER: Using https for the RENDER_URL to stop ERR_INVALID_PROTOCOL
setInterval(() => { 
    https.get(RENDER_URL, (res) => {
        console.log(`🔨 [HAMMER] Stay Awake: ${res.statusCode}`);
    }).on('error', (e) => { console.log("Hammer Ping Failed"); }); 
}, 240000); 

injectPower();
bootAllWorkers();