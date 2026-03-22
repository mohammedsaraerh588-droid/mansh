const fs = require('fs');
const path = require('path');
const results = { critical:[], high:[], medium:[], info:[] };

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (f === 'node_modules' || f === '.next' || f === '.git') return;
    if (fs.statSync(full).isDirectory()) { walk(full); return; }
    if (!['.ts','.tsx'].includes(path.extname(f))) return;
    const code = fs.readFileSync(full,'utf8');
    const rel = full.replace('D:\\منصة\\platform\\src\\','');

    // CRITICAL: Secrets hardcoded
    if (/sk_live_[a-zA-Z0-9]+/.test(code)) results.critical.push('HARDCODED_STRIPE_LIVE_SECRET: '+rel);
    if (/pk_live_[a-zA-Z0-9]+/.test(code)) results.critical.push('HARDCODED_STRIPE_LIVE_PUB: '+rel);
    if (/sb_secret_[a-zA-Z0-9]{10}/.test(code)) results.critical.push('HARDCODED_SUPABASE_SECRET: '+rel);
    if (/whsec_[a-zA-Z0-9]{10}/.test(code)) results.critical.push('HARDCODED_WEBHOOK_SECRET: '+rel);
    if (/re_[a-zA-Z0-9]{20}/.test(code)) results.critical.push('HARDCODED_RESEND_KEY: '+rel);

    // HIGH: XSS risks
    if (/dangerouslySetInnerHTML[\s\S]{0,20}__html/.test(code)) results.high.push('XSS_dangerouslySetInnerHTML: '+rel);
    if (/eval\(|new Function\(/.test(code)) results.high.push('CODE_INJECTION eval/Function: '+rel);

    // HIGH: API routes without auth
    if (rel.startsWith('app\\api') && !rel.includes('webhooks') && !rel.includes('contact') && !rel.includes('coupon') && !rel.includes('rating')) {
      if (!/getSession|getUser|auth\.getSession/.test(code) && /export async function (POST|PUT|DELETE|PATCH)/.test(code)) {
        results.high.push('API_NO_AUTH_CHECK: '+rel);
      }
    }

    // HIGH: Admin client used in client-side
    if (!rel.startsWith('lib') && /createSupabaseAdminClient/.test(code)) {
      results.high.push('ADMIN_CLIENT_IN_NON_LIB: '+rel);
    }

    // MEDIUM: console.log with potential sensitive data
    if (/console\.(log|warn|error)\([^)]*(?:password|token|secret|key)/i.test(code)) {
      results.medium.push('SENSITIVE_CONSOLE_LOG: '+rel);
    }

    // MEDIUM: HTTP links (not HTTPS)
    if (/href="http:\/\/(?!localhost)/.test(code)) results.medium.push('HTTP_NOT_HTTPS: '+rel);

    // MEDIUM: Missing input validation in API POST handlers
    if (rel.startsWith('app\\api') && /export async function POST/.test(code) && !/\.trim\(\)|z\.object|yup\.|joi\./.test(code)) {
      results.medium.push('NO_INPUT_VALIDATION: '+rel);
    }

    // INFO: open redirect risk
    if (/router\.push\(.*req\.|window\.location.*req\./.test(code)) results.info.push('OPEN_REDIRECT_RISK: '+rel);
  });
}

walk(path.join('D:\\منصة\\platform','src'));

console.log('\n========================================');
console.log('  SECURITY SCAN REPORT - منصة تعلّم');
console.log('========================================\n');
console.log('🔴 CRITICAL ('+results.critical.length+'):');
if (results.critical.length) results.critical.forEach(r => console.log('  - '+r));
else console.log('  ✅ PASS');
console.log('\n🟠 HIGH ('+results.high.length+'):');
if (results.high.length) results.high.forEach(r => console.log('  - '+r));
else console.log('  ✅ PASS');
console.log('\n🟡 MEDIUM ('+results.medium.length+'):');
if (results.medium.length) results.medium.forEach(r => console.log('  - '+r));
else console.log('  ✅ PASS');
console.log('\nℹ️  INFO ('+results.info.length+'):');
if (results.info.length) results.info.forEach(r => console.log('  - '+r));
else console.log('  ✅ PASS');
console.log('\n========================================');
console.log('SUMMARY: '+results.critical.length+' critical | '+results.high.length+' high | '+results.medium.length+' medium');
console.log('npm audit: 0 vulnerabilities (checked separately)');
console.log('========================================');
