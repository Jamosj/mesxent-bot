const axios = require('axios');
const net = require('net');

// 1. TIERION/CHAINPOINT - The Proof of Work
async function anchorProof(msg) {
    try {
        const hash = Buffer.from(msg).toString('hex');
        await axios.post('https://b.chainpoint.org/hashes', { hashes: [hash] });
        console.log("On-Chain Proof Created.");
    } catch (e) { console.log("Tierion Gateway Busy"); }
}

// 2. STRATUM - The Mining Worker
const client = new net.Socket();
client.connect(3333, 'stratum.viabtc.com', () => {
    client.write(JSON.stringify({id: 1, method: "mining.subscribe", params: []}) + '\n');
    client.write(JSON.stringify({id: 2, method: "mining.authorize", params: ["11270629836102.bot01", "x"]}) + '\n');
});

// 3. EXECUTION
setInterval(() => {
    console.log("Bot Flying...");
    anchorProof("AD_DELIVERY_2423081");
}, 600000); // Runs every 10 mins
