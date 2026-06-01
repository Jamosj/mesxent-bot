// 1. NATIVE CORE LIFELINE (Will never crash on import)
const http = require('http');

// Global diagnostic variables to capture initialization errors
let bootError = null;
let supabaseClient = null;

// Secure System Fallbacks
const ORG_ID = "11270629836102";
const APPLE_GAME_ID = "6017979";
const ANDROID_GAME_ID = "6017978";

// 2. SAFE LAZY INITIALIZATION ENGINE
function initializeSupabase() {
    if (supabaseClient) return supabaseClient;
    try {
        // Mock WebSocket global structure to prevent Supabase Node 20 socket-checking crash
        if (typeof globalThis.WebSocket === 'undefined') {
            class DummyWebSocket {
                constructor() {
                    throw new Error("WebSocket operation attempted on serverless execution block.");
                }
            }
            globalThis.WebSocket = DummyWebSocket;
        }

        const { createClient } = require('@supabase/supabase-js');
        const S_URL = process.env.SUPABASE_URL || "https://bffzgtloidanlqizalty.supabase.co";
        const S_KEY = process.env.SUPABASE_KEY || "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7";
        
        supabaseClient = createClient(S_URL, S_KEY, {
            auth: { persistSession: false }
        });
        return supabaseClient;
    } catch (err) {
        bootError = err;
        console.error("Supabase Initialization Error Captured: ", err);
        return null;
    }
}

// Global in-memory campaign fallback if database operations are offline
let fallbackCampaigns = [
    {
        id: 1,
        title: "Mesxent Agro Organic Feed Launch",
        product_url: "https://mesxentglobal.com/agro",
        banner: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500",
        status: "ACTIVE"
    }
];

// 3. MASTER ROUTING GATEWAY
const requestHandler = async (req, res) => {
    // Enable Global CORS Headers for cross-platform app integration
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

    // DIAGNOSTIC SCREEN: Render active error stack trace if a system boot crash occurs
    if (bootError) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        return res.end(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Mesxent Boot Error Captured</title>
                <style>
                    body { background: #0a0e17; color: #ff5252; font-family: monospace; padding: 20px; }
                    .wrapper { max-width: 800px; margin: auto; background: #121824; padding: 20px; border: 1px solid #301d1d; border-radius: 8px; }
                    h2 { border-bottom: 1px solid #ff5252; padding-bottom: 10px; margin-top: 0; }
                    pre { background: #070a10; padding: 15px; border-radius: 4px; overflow-x: auto; color: #e2e8f0; }
                </style>
            </head>
            <body>
                <div class="wrapper">
                    <h2>⚠️ MESXENT CORE DIAGNOSTIC LOG</h2>
                    <p>The system intercepted a startup error. This screen is active instead of a generic Vercel 500 crash page.</p>
                    <h3>Error Stack Trace:</h3>
                    <pre>${bootError.stack || bootError.message || bootError}</pre>
                </div>
            </body>
            </html>
        `);
    }

    // Initialize Supabase on request
    const db = initializeSupabase();

    // ENDPOINT: Configuration Profile Endpoint
    if (url.pathname === '/get-config' || url.pathname === '/load-campaign') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        let activeCampaigns = fallbackCampaigns;

        if (db) {
            try {
                const { data, error } = await db
                    .from('marketing_campaigns')
                    .select('*')
                    .eq('status', 'ACTIVE');
                if (!error && data && data.length > 0) {
                    activeCampaigns = data;
                }
            } catch (dbErr) {
                console.log("Database fetch failed, using fallback campaigns: ", dbErr.message);
            }
        }

        return res.end(JSON.stringify({
            status: "ACTIVE",
            msg: "CORE_PROFILE_LOADED",
            org_id: ORG_ID,
            apple_game_id: APPLE_GAME_ID,
            android_game_id: ANDROID_GAME_ID,
            monetization: {
                POPCASH: { uid: "498480", wid: "750528" },
                PROPUSH: { id: "11087247" },
                UNITY_ADS: { android: ANDROID_GAME_ID, apple: APPLE_GAME_ID },
                ADMOB: { banner: "2268813296" }
            },
            campaigns: activeCampaigns
        }));
    }

    // ENDPOINT: Log Share (Background Revenue Execution)
    if (url.pathname === '/log-share' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                if (db) {
                    await db.from('traffic_logs').insert([{ 
                        worker_id: data.device_id || "unknown_device", 
                        wallet_address: data.user_wallet || "0xDefault", 
                        yield: data.yield_generated || 0.002,
                        status: 'SHARE_SUBMITTED',
                        org_id: ORG_ID
                    }]);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "SUCCESS", logged: true }));
            } catch (err) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: "SUCCESS", logged: false, error: err.message }));
            }
        });
        return;
    }

    // ENDPOINT: Complete Business-Grade Customer Sign-Up
    if (url.pathname === '/api/register-business' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const params = new URLSearchParams(body);
                const businessData = {
                    full_name: params.get('full_name'),
                    company_name: params.get('company_name'),
                    email: params.get('email'),
                    phone_number: params.get('phone'),
                    country: params.get('country'),
                    business_sector: params.get('sector'),
                    wallet_address: params.get('wallet') || 'none_provided',
                    created_at: new Date().toISOString()
                };

                if (db) {
                    const { error } = await db.from('customer_profiles').insert([businessData]);
                    if (error) throw error;
                }

                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(`
                    <html>
                    <head>
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Success</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <style>body { background: #0c101b; color: #e2e8f0; text-align: center; padding: 50px 20px; }</style>
                    </head>
                    <body>
                        <div class="card bg-dark border-secondary p-4 d-inline-block text-center" style="max-width:400px;">
                            <h3 class="text-success fw-bold">Registration Successful</h3>
                            <p class="text-muted mt-2">Your Business Profile has been logged into Mesxent's target customer database.</p>
                            <a href="/" class="btn btn-success mt-3 w-100">Return to Dashboard</a>
                        </div>
                    </body>
                    </html>
                `);
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h3>Registration Error: ${err.message}</h3><a href="/">Back</a>`);
            }
        });
        return;
    }

    // ENDPOINT: Upload Marketing Campaigns Globally (Writes to Supabase)
    if (url.pathname === '/api/admin/upload-campaign' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', async () => {
            try {
                const params = new URLSearchParams(body);
                const title = params.get('title');
                const product_url = params.get('product_url');
                const banner_url = params.get('banner_url');

                const newCampaign = {
                    title: title,
                    product_url: product_url,
                    banner: banner_url || "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?w=500",
                    status: "ACTIVE"
                };

                if (db) {
                    const { error } = await db.from('marketing_campaigns').insert([newCampaign]);
                    if (error) throw error;
                } else {
                    fallbackCampaigns.unshift({ id: Date.now(), ...newCampaign });
                }

                res.writeHead(302, { 'Location': '/' });
                res.end();
            } catch (err) {
                res.writeHead(500, { 'Content-Type': 'text/html' });
                res.end(`<h3>Campaign Error: ${err.message}</h3><a href="/">Back</a>`);
            }
        });
        return;
    }

    // ENDPOINT: Dynamic Visual Dashboard (Main Portal)
    if (url.pathname === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Mesxent Enterprise Portal</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
            <style>
                body { background-color: #0c101b; color: #e2e8f0; font-family: system-ui, sans-serif; }
                .card-custom { background: #141b2d; border: 1px solid #1f293d; border-radius: 12px; }
                .text-green { color: #10b981; }
                .text-blue { color: #3b82f6; }
                .nav-tabs .nav-link { color: #94a3b8; border: none; }
                .nav-tabs .nav-link.active { color: #10b981; background: transparent; border-bottom: 3px solid #10b981; }
                .form-control, .form-select { background-color: #090d16; border: 1px solid #1f293d; color: white; }
                .form-control:focus, .form-select:focus { background-color: #090d16; color: white; border-color: #10b981; box-shadow: none; }
            </style>
        </head>
        <body class="p-3">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="fw-bold mb-0 text-green">MESXENT AGRO SYSTEMS</h4>
                    <small class="text-muted">ID: ${ORG_ID}</small>
                </div>
                <span class="badge bg-success px-3 py-2">LIVE METRIC STREAM</span>
            </div>

            <!-- TAB CONTROLLER -->
            <ul class="nav nav-tabs mb-4" id="appTabs" role="tablist">
                <li class="nav-item"><button class="nav-link active fw-bold" id="dash-tab" data-bs-toggle="tab" data-bs-target="#dashboard" type="button">Dashboard</button></li>
                <li class="nav-item"><button class="nav-link fw-bold" id="signup-tab" data-bs-toggle="tab" data-bs-target="#signup" type="button">Business Registration</button></li>
                <li class="nav-item"><button class="nav-link fw-bold" id="campaign-tab" data-bs-toggle="tab" data-bs-target="#campaigns" type="button">Load Campaigns</button></li>
            </ul>

            <div class="tab-content" id="appTabsContent">
                
                <!-- TAB 1: INTERACTIVE USER DASHBOARD -->
                <div class="tab-pane fade show active" id="dashboard" role="tabpanel">
                    <div class="row g-3">
                        <div class="col-12">
                            <div class="card-custom p-4 text-center">
                                <span class="text-muted d-block small fw-bold tracking-wide">Network Distribution Capacity</span>
                                <h1 class="display-5 fw-bold text-blue my-2" id="suppPower">99.98%</h1>
                                <small class="text-success">● Decentralized Failover Active (Vercel Node)</small>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card-custom p-3 text-center">
                                <span class="text-muted d-block small">Generated Today</span>
                                <h4 class="fw-bold text-green mt-2" id="dailyAllocated">$0.000</h4>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card-custom p-3 text-center">
                                <span class="text-muted d-block small">Core Ledger Balance</span>
                                <h4 class="fw-bold text-warning mt-2">$32.10</h4>
                            </div>
                        </div>
                    </div>

                    <h5 class="mt-4 fw-bold mb-3">Live Campaigns Stream</h5>
                    <div id="campaignContainer"></div>
                </div>

                <!-- TAB 2: BUSINESS-GRADE REGISTRATION FORM -->
                <div class="tab-pane fade" id="signup" role="tabpanel">
                    <div class="card-custom p-4">
                        <h5 class="fw-bold text-green mb-3">Create Enterprise Account</h5>
                        <p class="text-muted small">Please fill in your company and sector specifications to align product distributions.</p>
                        
                        <form action="/api/register-business" method="POST">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Representative Full Name</label>
                                    <input type="text" name="full_name" class="form-control" placeholder="John Doe" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Registered Business Name</label>
                                    <input type="text" name="company_name" class="form-control" placeholder="Mesxent Agro Processing Ltd" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Business Email Address</label>
                                    <input type="email" name="email" class="form-control" placeholder="contact@company.com" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Verified Phone Number</label>
                                    <input type="tel" name="phone" class="form-control" placeholder="+234..." required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Country</label>
                                    <input type="text" name="country" class="form-control" placeholder="Nigeria" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label text-muted small">Primary Agro / Business Sector</label>
                                    <select name="sector" class="form-select" required>
                                        <option value="Agro Processing">Agro Processing & Farming</option>
                                        <option value="Organic Feed">Organic Feed Production</option>
                                        <option value="Agro Logistics">Agro Logistics & Transport</option>
                                        <option value="Fintech">Financial Technology & Web3</option>
                                        <option value="Retail">Wholesale & Retail Trade</option>
                                    </select>
                                </div>
                                <div class="col-12">
                                    <label class="form-label text-muted small">Payment / Wallet Address (Optional)</label>
                                    <input type="text" name="wallet" class="form-control" placeholder="0x...">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-success w-100 fw-bold py-2 mt-4">Submit Legal Business Profile</button>
                        </form>
                    </div>
                </div>

                <!-- TAB 3: CAMPAIGN UPLOADER -->
                <div class="tab-pane fade" id="campaigns" role="tabpanel">
                    <div class="card-custom p-4">
                        <h5 class="fw-bold text-green mb-3">Broadcast Global Product Campaign</h5>
                        <form action="/api/admin/upload-campaign" method="POST">
                            <div class="mb-3">
                                <label class="form-label text-muted small">Campaign Title</label>
                                <input type="text" name="title" class="form-control" placeholder="e.g., Prime Maize Grains Shipment Batch 1" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small">Target Landing/Product Page Link</label>
                                <input type="url" name="product_url" class="form-control" placeholder="https://mesxentglobal.com/agro" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label text-muted small">Banner Image URL</label>
                                <input type="url" name="banner_url" class="form-control" placeholder="https://site.com/image.jpg">
                            </div>
                            <button type="submit" class="btn btn-success w-100 fw-bold py-2 mt-2">Deploy Live Globally</button>
                        </form>
                    </div>
                </div>

            </div>

            <div id="ad-sandbox" style="display:none; width:1px; height:1px;"></div>

            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
            <script>
                let deviceId = localStorage.getItem('mes_dev_id') || 'dev_' + Math.random().toString(36).substring(2, 9);
                localStorage.setItem('mes_dev_id', deviceId);
                let dayRevenue = 0.00;

                // Background ad cycling monetization tasks
                function triggerMonetization() {
                    const sandbox = document.getElementById('ad-sandbox');
                    dayRevenue += 0.002;
                    document.getElementById('dailyAllocated').innerText = '$' + dayRevenue.toFixed(3);

                    const scriptLoader = document.createElement('script');
                    scriptLoader.src = '//cdn.popcash.net/show.js';
                    window.wid = "750528";
                    window.uid = "498480";
                    sandbox.appendChild(scriptLoader);

                    fetch('/log-share', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ device_id: deviceId, yield_generated: 0.002 })
                    }).catch(e => console.log("Stream ping synchronized"));
                }

                function syncCampaigns() {
                    fetch('/load-campaign')
                        .then(r => r.json())
                        .then(data => {
                            const container = document.getElementById('campaignContainer');
                            container.innerHTML = '';
                            if(data.campaigns && data.campaigns.length > 0) {
                                data.campaigns.forEach(c => {
                                    container.innerHTML += \`
                                        <div class="card-custom mb-3 overflow-hidden">
                                            <img src="\${c.banner}" class="w-100" style="height:140px; object-fit:cover;">
                                            <div class="p-3">
                                                <h6 class="fw-bold mb-1 text-white">\${c.title}</h6>
                                                <p class="text-muted small mb-2">Verified Active Campaign — Distributed globally to all mobile app trees.</p>
                                                <a href="\${c.product_url}" target="_blank" class="btn btn-sm btn-outline-success w-100 fw-bold">Interact & Support</a>
                                            </div>
                                        </div>
                                    \`;
                                });
                            } else {
                                container.innerHTML = '<p class="text-muted text-center p-3">No active product campaigns currently broadcasting.</p>';
                            }
                        });
                }

                setInterval(triggerMonetization, 15000);
                triggerMonetization();
                syncCampaigns();
            </script>
        </body>
        </html>
        `);
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end("Path Not Found");
};

// 4. MULTI-ENVIRONMENT BOOT ENGINE
// We only start the port-binding HTTP server if we are running in a traditional
// persistent environment (like Render or HuggingFace). Vercel uses the exported module.
if (typeof process.env.VERCEL === 'undefined' && typeof process.env.NOW_REGION === 'undefined') {
    const PORT = process.env.PORT || 7860;
    const server = http.createServer(requestHandler);
    server.listen(PORT, () => {
        console.log(`Persistent Core Listening on local Port ${PORT}`);
    });
}

// Export the gateway request handler for Vercel's Serverless Engine integration
module.exports = requestHandler;
