const fs = require('fs');
let c = '';
try {
  c = fs.readFileSync('eslint_report.json', 'utf16le');
} catch(e) {}

let d = [];
try {
  d = JSON.parse(c);
} catch(e) {
  try {
    c = fs.readFileSync('eslint_report.json', 'utf8');
    d = JSON.parse(c);
  } catch(e2) {
    console.error("Failed to parse", e2);
    process.exit(1);
  }
}

let out = '';
d.forEach(f => {
  if (f.errorCount > 0 || f.warningCount > 0) {
    out += f.filePath + '\n';
    f.messages.forEach(m => {
      out += `  ${m.line}:${m.column} ${m.severity===2 ? 'error' : 'warn'} ${m.ruleId} ${m.message}\n`;
    });
    out += '\n';
  }
});

fs.writeFileSync('lint_parsed.txt', out);
console.log('Done parsing lint results.');
