const http = require('http');
const net = require('net');
const { createClient } = require('@supabase/supabase-js');

// 1. IDENTITY & CONFIG
const S_URL = "https://bffzgtloidanlqizalty.supabase.co"; 
const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7"; 
const supabase = createClient(S_URL, S_KEY);
const VIA_BTC_USER = "Mesxent001";
const RENDER_URL = "https://mesxent-global-engine.onrender.com";

const POOLS = [
    { name: 'BTC', host: 'bitcoin.viabtc.com', port: 443 },
    { name: 'LTC', host: 'ltc.viabtc.com', port: 443 },
    { name: 'KAS', host: 'mining.viabtc.io', port: 3015 }
];

// 2. THE WEB SERVER (Port Binding + Ad Lanes)
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    
    // Global Advertising Lane Receiver
    if (url.pathname === '/broadcast' || url.pathname === '/register') {
        const worker = url.searchParams.get('worker') || url.searchParams.get('userid');
        const msg = url.searchParams.get('msg') || "Registration Sync";
        
        console.log(`🚀 [LANE BROADCAST] Worker ${worker} Activity: ${msg}`);
        
        if (url.pathname === '/broadcast' && worker !== "Unknown") {
            auditMonetization(worker, msg);
        }

        res.writeHead(200);
        res.end("MESXENT SYSTEM: DATA RECEIVED");
        return;
    }

    res.writeHead(200);
    res.end("MESXENT GLOBALAGRITECH: ENGINE PERMANENTLY ACTIVE");
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
});

// 3. THE ZOMBIE ENGINE (Mining Persistence)
async function bootAllWorkers() {
    console.log("🧟 [ZOMBIE] Waking up all workers on the pool...");
    const { data: users } = await supabase.from('workers').select('user_id');
    if (users) {
        users.forEach(u => {
            POOLS.forEach(pool => {
                const s = new net.Socket();
                s.connect(pool.port, pool.host, () => {
                    s.write(JSON.stringify({id:1, method:"mining.authorize", params:[`${VIA_BTC_USER}.u${u.user_id}`,"x"]}) + '\n');
                });
                s.on('error', () => {}); // Silent fail to prevent crash
            });
        });
    }
}

// 4. MASTER HASHRATE INJECTION
function injectMaster() {
    POOLS.forEach(p => {
        const c = new net.Socket();
        c.connect(p.port, p.host, () => {
            c.write(JSON.stringify({id:2, method:"mining.authorize", params:[`${VIA_BTC_USER}.001`,"x"]}) + '\n');
            c.write(JSON.stringify({id:3, method:"mining.suggest_difficulty", params:[524288]}) + '\n');
        });
        c.on('error', () => {});
    });
}

// 5. MONETIZATION AUDITOR
async function auditMonetization(workerId, campaign) {
    console.log(`[CASH] Verifying revenue for Worker: ${workerId}`);
    try {
        // Ping Supabase to increment pips for the labor
        await supabase.from('workers').update({ status: 'LABOR_ACTIVE' }).eq('user_id', workerId);
    } catch (e) {
        console.log("[ERROR] Monetization Sync Failed");
    }
}

// 6. EXECUTION INTERVALS
setInterval(bootAllWorkers, 600000); // 10 mins
setInterval(injectMaster, 300000);   // 5 mins
setInterval(() => {
    http.get(RENDER_URL, (res) => { console.log("Self-Ping Success"); }).on('error', (e) => {});
}, 240000); // 4 mins

// Launch immediate
bootAllWorkers();
injectMaster();