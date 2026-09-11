const fs = require('fs');
let html = fs.readFileSync('teacher.html', 'utf8');

// Notice container
const noticeStart = html.indexOf('<div class="flex flex-col gap-3.5 mt-2" id="noticeFeedContainer">');
const noticeEnd = html.indexOf('</section>', noticeStart);

if (noticeStart !== -1 && noticeEnd !== -1) {
    html = html.substring(0, noticeStart) +
           '<div class="flex flex-col gap-3.5 mt-2" id="noticeFeedContainer">\n' +
           '        <!-- Dynamic Notices will be rendered here -->\n' +
           '      </div>\n    ' +
           html.substring(noticeEnd);
}

// Reports container
const reportStart = html.indexOf('<div id="reportsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-5">');
const reportEnd = html.indexOf('</section>', reportStart);

if (reportStart !== -1 && reportEnd !== -1) {
    html = html.substring(0, reportStart) +
           '<div id="reportsContainer" class="grid grid-cols-1 md:grid-cols-2 gap-5">\n' +
           '        <!-- Dynamic Reports will be rendered here -->\n' +
           '      </div>\n    ' +
           html.substring(reportEnd);
}

fs.writeFileSync('teacher.html', html);
console.log('teacher.html containers emptied');
