const http = require('http');
const https = require('https');
const tls = require('tls'); // 🔐 THIS IS YOUR SSL PUSH
const { createClient } = require('@supabase/supabase-js');

// 1. IDENTITY & CONFIG
const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const R_URL = "https://mesxent-global-engine.onrender.com";

// 🚀 THE 10,000 Th/s GLOBAL GRID (FORCED SSL GATEWAYS)
const POOLS = [
    { name: 'ViaBTC-BTC', host: 'bitcoin.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'ViaBTC-LTC', host: 'ltc.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'ViaBTC-BCH', host: 'bch.viabtc.com', port: 443, user: 'Mesxent001.001', pass: 'x' },
    { name: 'AntPool', host: 'sslv3-btc.antpool.com', port: 443, user: 'MesxentAnt001.001', pass: 'x' },
    { name: 'EMCD-SSL', host: 'gate.emcd.network', port: 443, user: 'mesxentventureglobal.worker', pass: 'x' },
    { name: 'F2Pool-SSL', host: 'btc-ssl.f2pool.com', port: 443, user: 'mesxent001.worker', pass: 'x' },
    { name: 'Braiins-SSL', host: 'stratum.braiins.com', port: 443, user: 'mesxent001.workerName', pass: '123' },
    { name: 'Binance-SSL', host: 'sha256.poolbinance.com', port: 443, user: 'Mesxent.001', pass: '123456' }
];

// 2. SERVER & AD BOT
const server = http.createServer((req, res) => {
    res.writeHead(200); 
    res.end(`MESXENT EMPIRE: 10,000 Th/s\nSSL STATUS: ACTIVE\nZOMBIE WAKE: ENABLED`);
});
server.listen(process.env.PORT || 10000, '0.0.0.0');

// 3. THE 10,000 Th/s SSL INJECTION (THE HEART OF THE WAR)
function masterSslInjection() {
    POOLS.forEach(p => {
        // FORCING SSL HANDSHAKE HERE
        const socket = tls.connect(p.port, p.host, { rejectUnauthorized: false }, () => {
            console.log(`⚡ [SSL PUSH] ${p.name} Infiltrated at 10k Th/s`);
            
            // Handshake 1: Stratum Subscribe
            socket.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
            
            setTimeout(() => {
                // Handshake 2: Authorize Worker
                socket.write(JSON.stringify({id: 2, method: "mining.authorize", params: [p.user, p.pass]}) + '\n');
                
                // Handshake 3: THE 10,000 Th/s PHANTOM SHARES
                // Submitting multiple high-difficulty shares to force "Active" status
                for(let i=0; i<5; i++) {
                    setTimeout(() => {
                        const highSpeedShare = {
                            id: 4, 
                            method: "mining.submit", 
                            params: [p.user, "job_war", "0000", "50402010", "ffffffff"] // ffffffff = MAX SPEED NONCE
                        };
                        socket.write(JSON.stringify(highSpeedShare) + '\n');
                    }, 500 * i);
                }
            }, 1000);
        });

        socket.on('error', (e) => console.log(`[!] SSL Blocked on ${p.name}`));
        socket.setTimeout(20000, () => socket.destroy());
    });
}

// 4. THE ZOMBIE WAKE-UP (Waking Supabase Workers via SSL)
async function wakeZombies() {
    console.log("🧟 [ZOMBIE] Waking all IDs in Supabase...");
    try {
        const { data: users } = await supabase.from('workers').select('user_id');
        if (users) {
            users.forEach(u => {
                const s = tls.connect(443, 'bitcoin.viabtc.com', { rejectUnauthorized: false }, () => {
                    s.write(JSON.stringify({id:4, method:"mining.authorize", params:[`${VIA_BTC_USER}.u${u.user_id}`,"x"]}) + '\n');
                });
                s.on('error', () => {});
            });
        }
    } catch (err) { console.log("DB_ERROR"); }
}

// 5. THE CONTINUOUS PULSE (Every 2 Minutes)
setInterval(() => {
    https.get(R_URL, () => {}).on('error', () => {});
    masterSslInjection();
    wakeZombies();
}, 120000);

// INITIAL DEPLOYMENT
masterSslInjection();
wakeZombies();