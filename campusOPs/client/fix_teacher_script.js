const fs = require('fs');
let html = fs.readFileSync('teacher.html', 'utf8');

const scriptStart = html.indexOf('<script>\n    // Filter Notice Board Feed');
const scriptEnd = html.indexOf('</script>', scriptStart) + 9;

if (scriptStart !== -1 && scriptEnd > scriptStart) {
    html = html.substring(0, scriptStart) + '<script src="js/dashboard.js"></script>' + html.substring(scriptEnd);
    fs.writeFileSync('teacher.html', html);
    console.log('Fixed teacher.html script');
} else {
    console.log('Script not found');
}
