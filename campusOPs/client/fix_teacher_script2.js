const fs = require('fs');
let html = fs.readFileSync('teacher.html', 'utf8');

const regex = /<script>[\s\S]*?function filterNotices[\s\S]*?<\/script>/;
if (regex.test(html)) {
    html = html.replace(regex, '<script src="js/dashboard.js"></script>');
    fs.writeFileSync('teacher.html', html);
    console.log('Fixed teacher.html script');
} else {
    console.log('Regex did not match');
}
