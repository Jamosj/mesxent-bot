const http = require('http');
const https = require('https');
const { createClient } = require('@supabase/supabase-js');

// 1. SECURE INITIALIZATION
const S_URL = "https://supabase.co";
const S_KEY = process.env.SUPABASE_KEY || "sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; 
const supabase = createClient(S_URL, S_KEY);
const R_URL = "https://onrender.com";

// 2. CRYPTO & AD MONITORING GLOBAL PROFILE
const POOLS = [
    { name: 'Luxor-BTC', host: 'btc.global.luxor.tech', port: 443 },
    { name: 'Poolin-BTC', host: 'btc-ssl.ss.poolin.me', port: 443 },
    { name: 'ViaBTC-BTC', host: '://viabtc.com', port: 443 },
    { name: 'AntPool', host: '://antpool.com', port: 443 }
];

// 3. SECURE CENTRALIZED API SERVER
const server = http.createServer(async (req, res) => {
    // Set CORS headers so your distributed user nodes can communicate with the server
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    const url = new URL(req.url, `http://${req.headers.host}`);

    // Endpoint for Distributed Web Nodes to pull their target profiles
    if (url.pathname === '/load-campaign' || url.pathname === '/get-config') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: "ACTIVE",
            msg: "CORE_PROFILE_LOADED",
            pools: POOLS,
            org_id: "11270120836102"
        }));
    }

    // Endpoint to securely log node activity without crushing server memory
    if (url.pathname === '/log-share' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // Directly logs node contribution to your active Supabase instance
                const { error } = await supabase
                    .from('traffic_logs')
                    .insert([{ worker_id: data.workerId, status: 'SHARE_SUBMITTED', yield: data.yield }]);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "SUCCESS" }));
            } catch (err) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "ERROR", msg: "INVALID_PAYLOAD" }));
            }
        });
        return;
    }

    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(`MESXENT ENGINE V22.0 // CLOUD CORE SECURED`);
});

// 4. LOW-IMPACT CLOUD KEEP-ALIVE ROUTINE
setInterval(() => {
    https.get(R_URL, (res) => {
        console.log(`[SYSTEM KEEP-ALIVE] Status Code: ${res.statusCode}`);
    }).on('error', (e) => { console.error(e); });
}, 600000); // Triggered every 10 minutes to save processing consumption

server.listen(process.env.PORT || 10000, '0.0.0.0', () => {
    console.log("Mesxent Cloud Master Control running smoothly.");
});
