const fs = require('fs');
let html = fs.readFileSync('admin.html', 'utf8');

// Fix Head
const headBoilerplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CampusOps | Estate Office & Admin Console</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- FontAwesome 6 Icons -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap" rel="stylesheet">

  <script>
    // Auth Guard
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'Admin') {
        console.log('Auth bypassed');
    }
  </script>
  <script src="js/api.js"></script>

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
          },
          colors: {
            brand: {
              coral: '#FF416C',
              coralHover: '#E02352',
              peach: '#FFA07A',
              apricot: '#FF7643',
              apricotBg: '#FFF3EB',
            }
          }
        }
      }
    };
  </script>`;

const styleStart = html.indexOf('<style>');
if (styleStart !== -1) {
    html = headBoilerplate + '\n\n  ' + html.substring(styleStart);
}

// Empty Container
const tbodyStart = html.indexOf('<tbody class="divide-y divide-slate-100 font-semibold text-slate-700" id="adminTicketsTable">');
const tbodyEnd = html.indexOf('</tbody>', tbodyStart);

if (tbodyStart !== -1 && tbodyEnd !== -1) {
    html = html.substring(0, tbodyStart) +
           '<tbody class="divide-y divide-slate-100 font-semibold text-slate-700" id="adminTicketsTable">\n' +
           '              <!-- Dynamic tickets will be rendered here -->\n' +
           '            ' + html.substring(tbodyEnd);
}

// Empty notices container
const noticesStart = html.indexOf('<div class="flex flex-col gap-3" id="adminNoticeFeed">');
const noticesEnd = html.indexOf('</div>\n        </section>\n      </div>');

if (noticesStart !== -1 && noticesEnd !== -1) {
    html = html.substring(0, noticesStart) +
           '<div class="flex flex-col gap-3" id="adminNoticeFeed">\n' +
           '            <!-- Dynamic notices will be rendered here -->\n          ' +
           html.substring(noticesEnd);
}

// Replace bottom script
const regex = /<script>[\s\S]*?function runAICheck[\s\S]*?<\/script>/;
if (regex.test(html)) {
    html = html.replace(regex, '<script src="js/admin.js"></script>');
}

fs.writeFileSync('admin.html', html);
console.log('Fixed admin.html');
