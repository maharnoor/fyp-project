const fs = require('fs');
const path = require('path');

const replacements = [
  // Tailwind classes
  { regex: /text-blue-400/g, replacement: 'text-zinc-300' },
  { regex: /text-blue-500/g, replacement: 'text-white' },
  { regex: /bg-blue-500\/10/g, replacement: 'bg-zinc-800/50' },
  { regex: /bg-blue-500\/20/g, replacement: 'bg-zinc-800' },
  { regex: /bg-blue-500/g, replacement: 'bg-white text-black' },
  { regex: /bg-blue-600/g, replacement: 'bg-zinc-200 text-black' },
  { regex: /border-blue-400/g, replacement: 'border-zinc-700' },
  { regex: /border-blue-500/g, replacement: 'border-zinc-700' },
  { regex: /ring-blue-500/g, replacement: 'ring-zinc-700' },
  { regex: /shadow-blue-500/g, replacement: 'shadow-none' },
  { regex: /from-blue-500/g, replacement: 'from-zinc-800' },
  { regex: /to-blue-500/g, replacement: 'to-zinc-900' },
  { regex: /via-blue-500/g, replacement: 'via-zinc-800' },
  { regex: /from-blue-600/g, replacement: 'from-zinc-800' },
  { regex: /to-blue-600/g, replacement: 'to-zinc-900' },
  
  // Hex colors from previous replacements
  { regex: /#3b82f6/g, replacement: '#FFFFFF' }, // blue-500 -> white
  { regex: /#60a5fa/g, replacement: '#EDEDED' }, // blue-400 -> off-white
  { regex: /#2563eb/g, replacement: '#A1A1AA' }, // blue-600 -> zinc-400
  { regex: /#93c5fd/g, replacement: '#D4D4D8' }, // blue-300 -> zinc-300
  
  // RGB colors
  { regex: /59,\s*130,\s*246/g, replacement: '255, 255, 255' },
  { regex: /96,\s*165,\s*250/g, replacement: '237, 237, 237' },
  { regex: /37,\s*99,\s*235/g, replacement: '161, 161, 170' },

  // Specific inline styles that look bad
  { regex: /border:\s*['"`]1px solid rgba\(255, 255, 255, 0\.3\)['"`]/g, replacement: "border: '1px solid #262626'" },
  { regex: /border:\s*`1px solid rgba\(255, 255, 255, 0\.4\)`/g, replacement: "`1px solid #3f3f46`" },
  { regex: /background:\s*['"`]rgba\(255, 255, 255, 0\.2\)['"`]/g, replacement: "background: '#18181b'" },
  { regex: /glass-hover/g, replacement: 'hover:border-zinc-600 transition-colors' },
  { regex: /glass/g, replacement: 'bg-[#0a0a0a] border border-[#262626]' },
  { regex: /animate-scale-in/g, replacement: 'animate-fade-in' },
  { regex: /animate-float/g, replacement: '' },
  { regex: /animate-pulse-glow/g, replacement: '' }
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      if (dirPath.endsWith('.js') || dirPath.endsWith('.jsx') || dirPath.endsWith('.css')) {
        callback(dirPath);
      }
    }
  });
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  replacements.forEach(r => {
    content = content.replace(r.regex, r.replacement);
  });
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated: ' + filePath);
  }
}

['app', 'components'].forEach(dir => {
  if (fs.existsSync(dir)) walkDir(dir, processFile);
});
