const fs   = require('fs');
const path = require('path');

// قائمة الملفات التي تحتاج try/catch
const files = [
  'D:\\منصة\\platform\\src\\app\\api\\contact\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\coupon\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\notes\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\notifications\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\quiz\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\rating\\route.ts',
  'D:\\منصة\\platform\\src\\app\\api\\wishlist\\route.ts',
];

let fixed = 0;
for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  
  // تحقق هل يوجد try/catch بالفعل
  if (/try\s*\{/.test(code)) {
    console.log('SKIP (has try/catch):', path.basename(path.dirname(file)) + '/' + path.basename(file));
    continue;
  }

  // أضف try/catch لكل export async function
  const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
  let changed = false;
  
  for (const method of methods) {
    const pattern = new RegExp(
      `(export async function ${method}\\([^{]*\\)\\s*\\{)([\\s\\S]*?)(^})`,
      'gm'
    );
    if (pattern.test(code)) {
      // أضف try/catch يلف المحتوى بالكامل
      code = code.replace(
        new RegExp(`(export async function ${method}\\([^{]*\\)\\s*\\{)`, 'g'),
        `$1\n  try {`
      );
      // أضف catch قبل آخر `}`
      // بسيط: استبدل آخر سطر `}` وحيد
      changed = true;
    }
  }
  
  if (changed) {
    console.log('NEEDS MANUAL FIX:', path.basename(file));
  }
}
console.log('Done.');
