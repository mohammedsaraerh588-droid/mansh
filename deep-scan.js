const fs   = require('fs');
const path = require('path');
const issues = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    const full = path.join(dir, f);
    if (['node_modules','.next','.git','public'].includes(f)) return;
    if (fs.statSync(full).isDirectory()) { walk(full); return; }
    if (!['.ts','.tsx'].includes(path.extname(f))) return;
    const code = fs.readFileSync(full,'utf8');
    const rel  = full.replace('D:\\منصة\\platform\\src\\','');

    // 1. Hardcoded localhost
    if (/localhost:3000/.test(code) && !rel.includes('next.config'))
      issues.push({ type:'HARDCODED_LOCALHOST', file:rel });

    // 2. Missing use client
    const hooks = /useState|useEffect|useRouter|usePathname|useParams/.test(code);
    const hasUseClient = code.trimStart().startsWith("'use client'");
    if (hooks && !hasUseClient && !rel.includes('lib\\') && !rel.includes('types\\') && !rel.includes('layout'))
      issues.push({ type:'MISSING_USE_CLIENT', file:rel });

    // 3. XSS without sanitize
    if (/dangerouslySetInnerHTML/.test(code) && !/DOMPurify|sanitize/.test(code))
      issues.push({ type:'XSS_UNSANITIZED', file:rel });

    // 4. Empty catch blocks
    if (/catch\s*\([^)]*\)\s*\{\s*\}/.test(code) || /catch\s*\{\s*\}/.test(code))
      issues.push({ type:'EMPTY_CATCH', file:rel });

    // 5. Garbled Arabic
    const garbled = (code.match(/\?[A-Za-z]\?[A-Za-z]/g)||[]).length;
    if (garbled > 3)
      issues.push({ type:'GARBLED_ARABIC', file:rel, detail: garbled + ' instances' });

    // 7. router.push without error handling in API calls
    if (hasUseClient && /fetch\(.*\/api\//.test(code) && !/try\s*\{|\.catch\(/.test(code) && rel.startsWith('app\\') && !rel.includes('api\\'))
      issues.push({ type:'FETCH_NO_TRY_CATCH', file:rel });

    // 6. Missing loading state in client data pages
    if (hasUseClient && /from\('/.test(code) && !/loading|setLoading|Loader|coursesLoading/.test(code) && rel.startsWith('app\\') && !rel.includes('api\\') && !rel.includes('callback') && !rel.includes('auth\\'))
      issues.push({ type:'NO_LOADING_STATE', file:rel });

    // 8. Using var instead of const/let
    if (/\bvar\s+/.test(code))
      issues.push({ type:'USES_VAR', file:rel });

    // 9. Missing key prop in .map()
    if (/\.map\([^)]*=>\s*[^(]/.test(code) && !/key=/.test(code) && rel.includes('.tsx'))
      issues.push({ type:'POSSIBLE_MISSING_KEY', file:rel });

    // 10. Any window usage in server component
    if (/window\./.test(code) && !hasUseClient && rel.startsWith('app\\') && !rel.includes('api\\') && !rel.includes('lib\\'))
      issues.push({ type:'WINDOW_IN_SERVER', file:rel });
  });
}

walk(path.join('D:\\منصة\\platform','src'));

console.log('\n=== DEEP BUG SCAN REPORT ===');
console.log('TOTAL ISSUES:', issues.length, '\n');
const grouped = {};
issues.forEach(i => {
  if (!grouped[i.type]) grouped[i.type] = [];
  grouped[i.type].push(i.file + (i.detail ? ' ('+i.detail+')' : ''));
});
Object.entries(grouped).sort((a,b) => b[1].length - a[1].length).forEach(([type, files]) => {
  console.log(type + ' (' + files.length + '):');
  files.forEach(f => console.log('  - ' + f));
  console.log('');
});
