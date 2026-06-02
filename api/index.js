module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'text/html');

    // Return a 200 OK pure frontend client app that handles everything cleanly in the browser
    res.writeHead(200);
    return res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Mesxent Enterprise Portal</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- Include Supabase directly via CDN to bypass Vercel serverless packaging crashes -->
        <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
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
                <small class="text-muted">ID: 11270629836102</small>
            </div>
            <span class="badge bg-success px-3 py-2">LIVE METRIC STREAM</span>
        </div>

        <ul class="nav nav-tabs mb-4" id="appTabs" role="tablist">
            <li class="nav-item"><button class="nav-link active fw-bold" id="dash-tab" data-bs-toggle="tab" data-bs-target="#dashboard" type="button">Dashboard</button></li>
            <li class="nav-item"><button class="nav-link fw-bold" id="signup-tab" data-bs-toggle="tab" data-bs-target="#signup" type="button">Business Registration</button></li>
            <li class="nav-item"><button class="nav-link fw-bold" id="campaign-tab" data-bs-toggle="tab" data-bs-target="#campaigns" type="button">Load Campaigns</button></li>
        </ul>

        <div class="tab-content" id="appTabsContent">
            
            <!-- TAB 1: DASHBOARD & STREAM -->
            <div class="tab-pane fade show active" id="dashboard" role="tabpanel">
                <div class="row g-3">
                    <div class="col-12">
                        <div class="card-custom p-4 text-center">
                            <span class="text-muted d-block small fw-bold">Network Distribution Capacity</span>
                            <h1 class="display-5 fw-bold text-blue my-2">99.98%</h1>
                            <small class="text-success">● Client-Side Edge Sync Active</small>
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

            <!-- TAB 2: COMPREHENSIVE BUSINESS REGISTER PORTAL -->
            <div class="tab-pane fade" id="signup" role="tabpanel">
                <div class="card-custom p-4">
                    <h5 class="fw-bold text-green mb-3">Create Enterprise Account</h5>
                    <p class="text-muted small">Fill out all standard corporate information fields to update your listing profile.</p>
                    
                    <form id="businessForm">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Representative Full Name</label>
                                <input type="text" id="reg_name" class="form-control" placeholder="John Doe" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Registered Business Name</label>
                                <input type="text" id="reg_company" class="form-control" placeholder="Mesxent Agro Ventures" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Business Email Address</label>
                                <input type="email" id="reg_email" class="form-control" placeholder="contact@company.com" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Verified Phone Number</label>
                                <input type="tel" id="reg_phone" class="form-control" placeholder="+234..." required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Country</label>
                                <input type="text" id="reg_country" class="form-control" placeholder="Nigeria" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted small">Primary Agro / Business Sector</label>
                                <select id="reg_sector" class="form-select" required>
                                    <option value="Agro Processing">Agro Processing & Farming</option>
                                    <option value="Organic Feed">Organic Feed Production</option>
                                    <option value="Agro Logistics">Agro Logistics & Transport</option>
                                    <option value="Fintech">Financial Technology & Web3</option>
                                </select>
                            </div>
                            <div class="col-12">
                                <label class="form-label text-muted small">Payment / Wallet Address</label>
                                <input type="text" id="reg_wallet" class="form-control" placeholder="0x...">
                            </div>
                        </div>
                        <button type="submit" class="btn btn-success w-100 fw-bold py-2 mt-4">Submit Profile Data</button>
                    </form>
                </div>
            </div>

            <!-- TAB 3: CAMPAIGN LOADER CONTROLLER -->
            <div class="tab-pane fade" id="campaigns" role="tabpanel">
                <div class="card-custom p-4">
                    <h5 class="fw-bold text-green mb-3">Broadcast Global Product Campaign</h5>
                    <form id="campaignForm">
                        <div class="mb-3">
                            <label class="form-label text-muted small">Campaign Title</label>
                            <input type="text" id="cam_title" class="form-control" placeholder="e.g., Organic Maize Batch Production" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Target Landing Link</label>
                            <input type="url" id="cam_url" class="form-control" placeholder="https://mesxentglobal.com" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label text-muted small">Banner Image URL</label>
                            <input type="url" id="cam_banner" class="form-control" placeholder="https://site.com/image.jpg">
                        </div>
                        <button type="submit" class="btn btn-success w-100 fw-bold py-2">Deploy Live Globally</button>
                    </form>
                </div>
            </div>

        </div>

        <div id="ad-sandbox" style="display:none; width:1px; height:1px;"></div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
        <script>
            // Initialize Direct Supabase Client on Frontend
            const S_URL = "https://bffzgtloidanlqizalty.supabase.co";
            const S_KEY = "sb_publishable_laCBEwCIQ2cXnErxgZqVgg_OfvW48C7";
            const _supabase = supabase.createClient(S_URL, S_KEY);

            let deviceId = localStorage.getItem('mes_dev_id') || 'dev_' + Math.random().toString(36).substring(2, 9);
            localStorage.setItem('mes_dev_id', deviceId);
            let dayRevenue = 0.00;

            const fallbackCampaigns = [{
                title: "Mesxent Agro Organic Feed Launch",
                product_url: "https://mesxentglobal.com/agro",
                banner: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500"
            }];

            // Monetization Loop
            function triggerMonetization() {
                dayRevenue += 0.002;
                document.getElementById('dailyAllocated').innerText = '$' + dayRevenue.toFixed(3);
                
                const sandbox = document.getElementById('ad-sandbox');
                const scriptLoader = document.createElement('script');
                scriptLoader.src = '//cdn.popcash.net/show.js';
                window.wid = "750528"; window.uid = "498480";
                sandbox.appendChild(scriptLoader);

                _supabase.from('traffic_logs').insert([{
                    worker_id: deviceId,
                    wallet_address: "0xDefault",
                    yield: 0.002,
                    status: 'SHARE_SUBMITTED',
                    org_id: "11270629836102"
                }]);
            }

            // Sync Stream Campaigns from Supabase
            async function syncCampaigns() {
                const container = document.getElementById('campaignContainer');
                container.innerHTML = '';
                
                let { data: campaigns, error } = await _supabase
                    .from('marketing_campaigns')
                    .select('*')
                    .eq('status', 'ACTIVE');

                let displayList = (campaigns && campaigns.length > 0) ? campaigns : fallbackCampaigns;

                displayList.forEach(c => {
                    container.innerHTML += \`
                        <div class="card-custom mb-3 overflow-hidden">
                            <img src="\${c.banner || fallbackCampaigns[0].banner}" class="w-100" style="height:140px; object-fit:cover;">
                            <div class="p-3">
                                <h6 class="fw-bold mb-1 text-white">\${c.title}</h6>
                                <p class="text-muted small mb-2">Active Campaign Loaded from Mesxent Distribution Gateway.</p>
                                <a href="\${c.product_url}" target="_blank" class="btn btn-sm btn-outline-success w-100 fw-bold">Interact & Support</a>
                            </div>
                        </div>
                    \`;
                });
            }

            // Handle Business Profile Signup
            document.getElementById('businessForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const profile = {
                    full_name: document.getElementById('reg_name').value,
                    company_name: document.getElementById('reg_company').value,
                    email: document.getElementById('reg_email').value,
                    phone_number: document.getElementById('reg_phone').value,
                    country: document.getElementById('reg_country').value,
                    business_sector: document.getElementById('reg_sector').value,
                    wallet_address: document.getElementById('reg_wallet').value || 'none_provided',
                    created_at: new Date().toISOString()
                };

                const { error } = await _supabase.from('customer_profiles').insert([profile]);
                if (error) {
                    alert("Submission error: " + error.message);
                } else {
                    alert("Success! Profile logged into Mesxent target customer database.");
                    document.getElementById('businessForm').reset();
                }
            });

            // Handle Campaign Upload Insertion
            document.getElementById('campaignForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                const campaignData = {
                    title: document.getElementById('cam_title').value,
                    product_url: document.getElementById('cam_url').value,
                    banner: document.getElementById('cam_banner').value || fallbackCampaigns[0].banner,
                    status: "ACTIVE"
                };

                const { error } = await _supabase.from('marketing_campaigns').insert([campaignData]);
                if (error) {
                    alert("Upload error: " + error.message);
                } else {
                    alert("Campaign launched successfully to all user app trees!");
                    document.getElementById('campaignForm').reset();
                    syncCampaigns();
                }
            });

            setInterval(triggerMonetization, 15000);
            triggerMonetization();
            syncCampaigns();
        </script>
    </body>
    </html>
    `);
};
