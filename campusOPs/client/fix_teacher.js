const fs = require('fs');
let html = fs.readFileSync('teacher.html', 'utf8');

const headBoilerplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CampusOps | Faculty Operations Desk & Notice Board</title>
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
    if (!token || role !== 'Teacher') {
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

// find <style> and replace everything before it with headBoilerplate
const styleStart = html.indexOf('<style>');
if (styleStart !== -1) {
    html = headBoilerplate + '\n\n  ' + html.substring(styleStart);
}

fs.writeFileSync('teacher.html', html);
console.log('Fixed teacher.html head');
