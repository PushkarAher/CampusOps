const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const locations = [
    'Block A - Room 101',
    'Block B - Room 204',
    'Block C - Room 302',
    'Block D - Room 405',
    'Lab 1 - Physics',
    'Lab 2 - Computer Science',
    'Classroom 1 - Ground Floor',
    'Classroom 2 - First Floor'
];

const qrDir = path.join(__dirname, '../client/qr file');
if (!fs.existsSync(qrDir)){
    fs.mkdirSync(qrDir, { recursive: true });
}

async function generateQRs() {
    for (const loc of locations) {
        try {
            // Encode as JSON to match typical structured data
            const data = JSON.stringify({ location: loc });
            const filePath = path.join(qrDir, `${loc.replace(/[^a-zA-Z0-9]/g, '_')}.png`);
            
            await QRCode.toFile(filePath, data, {
                color: {
                    dark: '#000000',  // Black dots
                    light: '#ffffff' // White background
                },
                width: 300
            });
            console.log(`Generated QR for ${loc}`);
        } catch (err) {
            console.error(`Failed to generate QR for ${loc}:`, err);
        }
    }
}

generateQRs();
