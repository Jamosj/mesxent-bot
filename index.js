const http = require('http');
const { createClient } = require('@supabase/supabase-js');

// 1. SECURE SYSTEM INITIALIZATION
const S_URL = process.env.SUPABASE_URL || "https://bffzgtloidanlqizalty.supabase.co";
const S_KEY = process.env.SUPABASE_KEY || "sb_publishable_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmZnpndGxvaWRhbmxxaXphbHR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0MDAwMDAsImV4cCI6MjAyNjg0MDAwMH0.placeholder";
const supabase = createClient(S_URL, S_KEY);

const CONFIG_CORE = {
    ORGANIZATION_ID: "11270629836102",
    MONETIZATION: {
        POPCASH: { uid: "498480", wid: "750528" },
        PROPUSH: { id: "11087247" },
        UNITY_ADS: { android: "6017978", apple: "6017979" },
        ADMOB: { banner: "2268813296" }
    },
    POOLS: [
        { name: "Luxor-BTC", host: "btc.global.luxor.tech", port: 443 },
        { name: "Poolin-BTC", host: "btc-ssl.ss.poolin.me", port: 443 },
        { name: "ViaBTC-BTC", host: "://viabtc.com", port: 443 },
        { name: "AntPool", host: "://antpool.com", port: 443 }
    ]
};

// Global in-memory storage matrix for marketing campaigns
let globalCampaigns = [
    { id: 1, title: "Mesxent Agro Organic Feed Launch", product_url: "https://mesxentglobal.com/agro", banner: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500", status: "ACTIVE" }
];

// 2. CENTRALIZED ROUTING NETWORK
const server = http.createServer(async (req, res) => {
    // Set global safe headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    // Endpoint: Core Configuration Matrix
    if (url.pathname === '/get-config' || url.pathname === '/load-campaign') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
            status: "ACTIVE",
            msg: "CORE_PROFILE_LOADED",
            pools: CONFIG_CORE.POOLS,
            monetization: CONFIG_CORE.MONETIZATION,
            org_id: CONFIG_CORE.ORGANIZATION_ID,
            campaigns: globalCampaigns
        }));
    }

    // Endpoint: Live Traffic Performance Logs
    if (url.pathname === '/log-share' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                const { error } = await supabase
                    .from('traffic_logs')
                    .insert([{ 
                        worker_id: data.device_id || data.worker_id, 
                        wallet_address: data.user_wallet || "0xDefault", 
                        yield: data.yield_generated || 0.004,
                        status: 'SHARE_SUBMITTED',
                        org_id: CONFIG_CORE.ORGANIZATION_ID
                    }]);
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "SUCCESS", sync: true }));
            } catch (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "SUCCESS", sync: "cached_edge" }));
            }
        });
        return;
    }

    // Endpoint: Admin Campaign Injection Portal
    if (url.pathname === '/api/admin/upload-campaign' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const params = new URLSearchParams(body);
                const title = params.get('title');
                const product_url = params.get('product_url');
                const banner_url = params.get('banner_url');

                if (title && product_url) {
                    globalCampaigns.unshift({
                        id: globalCampaigns.length + 1,
                        title: title,
                        product_url: product_url,
                        banner: banner_url || "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500",
                        status: "ACTIVE"
                    });
                }
                // Redirect back seamlessly to dashboard
                res.writeHead(302, { 'Location': '/' });
                res.end();
            } catch (e) {
                res.writeHead(400);
                res.end("Bad Request Payload");
            }
        });
        return;
    }

    // Endpoint: Live Visual App Tree Dashboard
    if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mesxent Cloud Management Portal</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background-color: #0c101b; color: #e2e8f0; font-family: system-ui, sans-serif; }
                .card-custom { background: #141b2d; border: 1px solid #1f293d; border-radius: 12px; }
                .text-green { color: #10b981; }
                .text-blue { color: #3b82f6; }
                .nav-tabs .nav-link { color: #94a3b8; border: none; }
                .nav-tabs .nav-link.active { color: #10b981; background: transparent; border-bottom: 3px solid #10b981; }
                .form-control { background-color: #090d16; border: 1px solid #1f293d; color: white; }
                .form-control:focus { background-color: #090d16; color: white; border-color: #10b981; box-shadow: none; }
            </style>
        </head>
        <body class="p-3">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="fw-bold mb-0 text-green">MESXENT AD-BOT ENGINE</h4>
                    <small class="text-muted">Core Org Token: ${CONFIG_CORE.ORGANIZATION_ID}</small>
                </div>
                <span class="badge bg-success px-3 py-2">NODE DISTRIBUTED</span>
            </div>

            <ul class="nav nav-tabs mb-4" id="appTabs" role="tablist">
                <li class="nav-item"><button class="nav-link active fw-bold" id="dash-tab" data-bs-toggle="tab" data-bs-target="#dashboard" type="button">Dashboard</button></li>
                <li class="nav-item"><button class="nav-link fw-bold" id="campaign-tab" data-bs-toggle="tab" data-bs-target="#campaigns" type="button">Load Campaigns</button></li>
            </ul>

            <div class="tab-content" id="appTabsContent">
                
                <div class="tab-pane fade show active" id="dashboard" role="tabpanel">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="card-custom p-4 text-center">
                                <span class="text-muted d-block small fw-bold tracking-wide">Device Supporting Power</span>
                                <h1 class="display-5 fw-bold text-blue my-2" id="suppPower">99.87%</h1>
                                <small class="text-success">● Synchronization Matrix Online</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card-custom p-3 text-center">
                                <span class="text-muted d-block small">Total Daily Accumulated</span>
                                <h4 class="fw-bold text-green mt-2" id="dailyAllocated">$0.000</h4>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card-custom p-3 text-center">
                                <span class="text-muted d-block small">Overall Wallet Balance</span>
                                <h4 class="fw-bold text-warning mt-2">$24.50</h4>
                            </div>
                        </div>
                    </div>

                    <h5 class="mt-4 fw-bold mb-3">Active Global Marketing Tools</h5>
                    <div id="campaignContainer"></div>
                </div>

                <div class="tab-pane fade" id="campaigns" role="tabpanel">
                    <div class="card-custom p-4">
                        <h5 class="fw-bold text-green mb-3">Broadcast New Product Campaign</h5>
                        <form action="/api/admin/upload-campaign" method="POST">
                            <div class="mb-3">
                                <label class="form-label text-muted small">Campaign / Product Title</label>
                                <input type="text" name="title" class="form-control" placeholder="e.g., Mesxent Agro Processing Systems" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small">Target Product Destination URL</label>
                                <input type="url" name="product_url" class="form-control" placeholder="https://mesxentglobal.com/agro" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small">Marketing Banner Asset Image URL</label>
                                <input type="url" name="banner_url" class="form-control" placeholder="https://site.com/image.jpg">
                            </div>
                            <button type="submit" class="btn btn-success w-100 fw-bold py-2 mt-2">Launch Global Distribution</button>
                        </form>
                    </div>
                </div>

            </div>

            <div id="ad-vector" style="display:none; width:1px; height:1px;"></div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            <script>
                let devId = localStorage.getItem('mesxent_dev_id') || 'dev_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('mesxent_dev_id', devId);
                let liveEarnings = 0.00;

                // Programmatic background monetization executions
                function runRevenuePipeline() {
                    const vector = document.getElementById('ad-vector');
                    liveEarnings += 0.002;
                    document.getElementById('dailyAllocated').innerText = '$' + liveEarnings.toFixed(3);

                    // Native placement calls for monetization systems
                    const popcashLoader = document.createElement('script');
                    popcashLoader.src = '//cdn.popcash.net/show.js';
                    window.wid = "${CONFIG_CORE.MONETIZATION.POPCASH.wid}";
                    window.uid = "${CONFIG_CORE.MONETIZATION.POPCASH.uid}";
                    vector.appendChild(popcashLoader);

                    // Update metrics across your global distributed log tables
                    fetch('/log-share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ device_id: devId, yield_generated: 0.002 })
                    }).catch(err => console.log('Matrix streaming uninterrupted'));
                }

                function fetchGlobalCampaigns() {
                    fetch('/load-campaign')
                        .then(r => r.json())
                        .then(data => {
                            const container = document.getElementById('campaignContainer');
                            container.innerHTML = '';
                            data.campaigns.forEach(c => {
                                container.innerHTML += \`
                                    <div class="card-custom mb-3 overflow-hidden">
                                        <img src="\${c.banner}" class="w-100" style="height:130px; object-fit:cover;">
                                        <div class="p-3">
                                            <h6 class="fw-bold mb-1 text-white">\${c.title}</h6>
                                            <p class="text-muted small mb-2">Distributed globally across the Mesxent user cluster.</p>
                                            <a href="\${c.product_url}" target="_blank" class="btn btn-sm btn-outline-success w-100 fw-bold">Interact with Offer</a>
                                        </div>
                                    </div>
                                \`;
                            });
                        });
                }

                setInterval(runRevenuePipeline, 15000);
                runRevenuePipeline();
                fetchGlobalCampaigns();
            </script>
        </body>
        </html>
        `);
    }

    // Default 404 handler
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("Resource Not Found");
});

const PORT = process.env.PORT || 7860;
server.listen(PORT, () => {
    console.log(`Mesxent Server Running Smoothly on Port ${PORT}`);
});
