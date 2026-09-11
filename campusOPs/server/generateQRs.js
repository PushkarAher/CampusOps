const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

const qrDir = path.join(__dirname, '../client/qr file');

// Create the directory if it doesn't exist
if (!fs.existsSync(qrDir)) {
    fs.mkdirSync(qrDir, { recursive: true });
}

const locations = [
    'Room 101',
    'Room 102',
    'Room 201',
    'Room 202',
    'CS Lab 1',
    'CS Lab 2',
    'Classroom A',
    'Classroom B'
];

async function generateQRCodes() {
    console.log('Generating QR Codes...');
    for (const location of locations) {
        const filePath = path.join(qrDir, `${location.replace(/ /g, '_')}.png`);
        try {
            await QRCode.toFile(filePath, location, {
                color: {
                    dark: '#FF416C',  // Brand coral
                    light: '#FFFFFF'
                },
                width: 300,
                margin: 2
            });
            console.log(`Generated: ${filePath}`);
        } catch (err) {
            console.error(`Failed to generate for ${location}:`, err);
        }
    }
    console.log('All QR codes generated successfully!');
}

generateQRCodes();
