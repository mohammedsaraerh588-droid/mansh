const fs   = require('fs');
const path = require('path');
const ROOT = 'D:\\منصة\\platform\\src';
const issues = [];

function add(sev, type, file, detail='') {
  issues.push({ sev, type, file: file.replace(ROOT+'\\',''), detail });
}

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (['node_modules','.next','.git'].includes(f)) continue;
    if (fs.statSync(full).isDirectory()) { walk(full); continue; }
    if (!['.ts','.tsx'].includes(path.extname(f))) continue;
    scan(full);
  }
}

function scan(file) {
  const code = fs.readFileSync(file,'utf8');
  const rel  = file.replace(ROOT+'\\','');
  const isClient = code.trimStart().startsWith("'use client'");
  const isAPI    = rel.startsWith('app\\api\\');
  const isPage   = rel.endsWith('page.tsx') || rel.endsWith('page.ts');
  const isLib    = rel.startsWith('lib\\');
  const lines    = code.split('\n');

  // ── SECURITY ──────────────────────────────────────────────
  // XSS: dangerouslySetInnerHTML without DOMPurify
  if (/dangerouslySetInnerHTML/.test(code) && !/DOMPurify\.sanitize/.test(code))
    add('CRITICAL','XSS_NO_SANITIZE', rel);

  // Hardcoded secrets
  if (/sk_live_[A-Za-z0-9]{10}|pk_live_[A-Za-z0-9]{10}/.test(code))
    add('CRITICAL','HARDCODED_STRIPE_LIVE', rel);

  // Hardcoded localhost in production code
  if (/["']http:\/\/localhost/.test(code) && !rel.includes('config'))
    add('HIGH','HARDCODED_LOCALHOST', rel);

  // ── RUNTIME ERRORS ────────────────────────────────────────
  // window/document in server component
  if (!isClient && !isLib && isPage && /\bwindow\b|\bdocument\b/.test(code) && !rel.includes('api\\'))
    add('HIGH','WINDOW_IN_SERVER', rel);

  // Missing 'use client' with hooks
  if (!isClient && !isLib && /\buseState\b|\buseEffect\b|\buseRouter\b|\busePathname\b|\buseParams\b/.test(code) && !rel.includes('layout') && !rel.includes('api\\'))
    add('HIGH','HOOKS_WITHOUT_USE_CLIENT', rel);

  // Unhandled promise (no await, no .then, no .catch on async calls)
  if (isClient && /fetch\(.*\/api\//.test(code) && !/try\s*\{|\.catch\(/.test(code))
    add('MEDIUM','UNHANDLED_FETCH', rel);

  // Empty catch blocks
  if (/catch\s*\([^)]*\)\s*\{\s*\}|catch\s*\{\s*\}/.test(code))
    add('MEDIUM','EMPTY_CATCH', rel);

  // ── LOGIC BUGS ────────────────────────────────────────────
  // API route missing auth check on POST/PUT/DELETE
  if (isAPI && !rel.includes('webhook') && !rel.includes('send-confirmation') && !rel.includes('contact') && !rel.includes('checkout\\verify')) {
    const hasMutate = /export async function (POST|PUT|DELETE|PATCH)/.test(code);
    const hasAuth   = /getSession|getUser|auth\.getUser/.test(code);
    if (hasMutate && !hasAuth) add('HIGH','API_NO_AUTH', rel);
  }

  // Missing error handling in API routes
  if (isAPI && !/try\s*\{/.test(code) && /export async function/.test(code))
    add('MEDIUM','API_NO_TRY_CATCH', rel);

  // ── CODE QUALITY ──────────────────────────────────────────
  // console.log with possible sensitive data
  if (/console\.log\(.*(?:password|token|secret|key|session)/i.test(code))
    add('MEDIUM','SENSITIVE_CONSOLE_LOG', rel);

  // Duplicate imports
  const imports = lines.filter(l => l.startsWith('import ')).map(l => l.trim());
  const seen = new Set();
  for (const imp of imports) {
    if (seen.has(imp)) add('LOW','DUPLICATE_IMPORT', rel, imp.slice(0,60));
    seen.add(imp);
  }

  // any type used extensively
  const anyCount = (code.match(/:\s*any\b/g)||[]).length;
  if (anyCount > 8) add('LOW','EXCESSIVE_ANY_TYPE', rel, anyCount + ' instances');

  // Missing key prop pattern
  if (isClient && /\.map\(.*=>\s*\(?\s*<(?!React\.Fragment|Fragment)[A-Z]/.test(code) && !/key=/.test(code))
    add('LOW','POSSIBLE_MISSING_KEY', rel);

  // ── PERFORMANCE ───────────────────────────────────────────
  // Large useEffect with no dependencies (infinite loop risk)
  const useEffectMatches = code.match(/useEffect\([^,]+,\s*\[\s*\]\)/g)||[];
  // ok — empty deps is fine for mount-only

  // Missing loading state in data-fetching pages
  if (isClient && isPage && /supabase\.from\(|fetch\(/.test(code) && !/loading|setLoading|isLoading/.test(code))
    add('LOW','NO_LOADING_STATE', rel);
}

walk(ROOT);
walk('D:\\منصة\\platform\\src');

// ── PRINT REPORT ──────────────────────────────────────────
const SEV_ORDER = ['CRITICAL','HIGH','MEDIUM','LOW'];
const grouped = {};
for (const i of issues) {
  const k = i.sev + '|' + i.type;
  if (!grouped[k]) grouped[k] = { sev:i.sev, type:i.type, files:[] };
  grouped[k].files.push(i.file + (i.detail?' → '+i.detail:''));
}

console.log('\n╔══════════════════════════════════════════╗');
console.log('║  COMPREHENSIVE BUG REPORT — منصة تعلّم  ║');
console.log('╚══════════════════════════════════════════╝\n');
console.log('Total issues found:', issues.length, '\n');

let total = {CRITICAL:0,HIGH:0,MEDIUM:0,LOW:0};
for (const [,v] of Object.entries(grouped)) total[v.sev] += v.files.length;
console.log(`🔴 CRITICAL: ${total.CRITICAL}  🟠 HIGH: ${total.HIGH}  🟡 MEDIUM: ${total.MEDIUM}  🔵 LOW: ${total.LOW}\n`);

for (const sev of SEV_ORDER) {
  const items = Object.values(grouped).filter(g=>g.sev===sev);
  if (!items.length) continue;
  const emoji = {CRITICAL:'🔴',HIGH:'🟠',MEDIUM:'🟡',LOW:'🔵'}[sev];
  for (const item of items) {
    console.log(`${emoji} [${sev}] ${item.type} (${item.files.length}):`);
    item.files.forEach(f => console.log(`   - ${f}`));
    console.log('');
  }
}
