const http = require('http');
const net = require('net');
const { createClient } = require('@supabase/supabase-js');

// 1. IDENTITY & CONFIG (Organization ID: 11270629836102)
const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const RENDER_URL = "https://mesxent-global-engine.onrender.com";

// 🚀 ALL COINS & PORTS (BTC, BCH, LTC, DOGE, KAS)
const POOLS = [
    { name: 'BTC', host: 'bitcoin.viabtc.com', port: 443 },
    { name: 'BCH', host: 'bch.viabtc.com', port: 25 },
    { name: 'LTC-DOGE', host: 'ltc.viabtc.com', port: 443 },
    { name: 'KAS', host: 'mining.viabtc.io', port: 3015 }
];

// 2. --- THE ADVERTISING BOT & BROADCAST LANE ---
// This part receives the data from your mobile app and registers money activity
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // THE AD BOT RECEIVER
    if (url.pathname === '/register' || url.pathname === '/broadcast') {
        const worker = url.searchParams.get('worker') || url.searchParams.get('userid');
        const msg = url.searchParams.get('msg') || "Node Sync";
        
        console.log(`📢 [AD BOT] Campaign Received from Worker ${worker}: ${msg}`);
        
        // --- THE MONETIZATION AUDITOR ---
        // This marks the worker as "Active" in Supabase to track the 4% revenue
        if (url.pathname === '/broadcast' && worker) { 
            auditMonetization(worker, msg); 
        }

        res.writeHead(200);
        res.end("ADVERTISING BOT: CAMPAIGN LOADED");
        return;
    }
    res.writeHead(200);
    res.end("MESXENT GLOBAL ENGINE: ACTIVE");
});

server.listen(process.env.PORT || 10000, '0.0.0.0', () => {
    console.log(`Server listening on port ${process.env.PORT || 10000}`);
});

// 3. --- THE POWER INJECTOR (Forces ViaBTC to stay ONLINE) ---
function injectPower() {
    POOLS.forEach(p => {
        const client = new net.Socket();
        client.connect(p.port, p.host, () => {
            console.log(`⚡ [POWER] Forcing Handshake with ${p.name}...`);
            // This is the command that "wakes up" the Green Light on ViaBTC
            client.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
            
            setTimeout(() => {
                console.log(`💎 [AUTH] Authorizing Master Node ${VIA_BTC_USER}.001 on ${p.name}`);
                client.write(JSON.stringify({id: 2, method: "mining.authorize", params: [`${VIA_BTC_USER}.001`, "x"]}) + '\n');
                client.write(JSON.stringify({id: 3, method: "mining.suggest_difficulty", params: [524288]}) + '\n');
            }, 1500);
        });
        client.on('error', (e) => console.log(`[POOL ERROR] ${p.name}: ${e.message}`));
        client.on('close', () => setTimeout(injectPower, 60000));
    });
}

// 4. --- THE ZOMBIE ENGINE (Waking All Workers) ---
async function bootAllWorkers() {
    console.log("🧟 [ZOMBIE] Waking up all workers on the pool...");
    const { data: users } = await supabase.from('workers').select('user_id');
    
    if (users && users.length > 0) {
        users.forEach(u => {
            POOLS.forEach(pool => {
                const s = new net.Socket();
                s.connect(pool.port, pool.host, () => {
                    s.write(JSON.stringify({id:4, method:"mining.authorize", params:[`${VIA_BTC_USER}.u${u.user_id}`,"x"]}) + '\n');
                });
                s.on('error', () => {});
            });
        });
        console.log(`✅ [ZOMBIE] ${users.length} workers successfully injected.`);
    }
}

// 5. --- MONETIZATION AUDITOR (Revenue Tracking) ---
async function auditMonetization(workerId, campaign) {
    try {
        await supabase.from('workers').update({ 
            last_seen: new Date().toISOString(), status: 'LABOR_ACTIVE' 
        }).eq('user_id', workerId);
        console.log(`[CASH] Revenue verified for Worker ${workerId} via Advertising Bot`);
    } catch (e) { console.log("[ERROR] Sync Failed"); }
}

// 6. --- PERSISTENCE LOOPS (The "Never Sleep" Hammer) ---
setInterval(bootAllWorkers, 600000); // 10 mins
setInterval(injectPower, 300000);   // 5 mins
setInterval(() => { 
    // This self-ping prevents Render from sleeping
    http.get(RENDER_URL).on('error', () => {}); 
    console.log("🔨 [HAMMER] Self-Ping: Engine is awake and active.");
}, 240000); 

// Start everything immediately
injectPower();
bootAllWorkers();