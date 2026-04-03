import puppeteer from 'puppeteer';
import { mkdirSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';
const width = parseInt(process.argv[4]) || 1440;
const height = parseInt(process.argv[5]) || 900;

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });

// Auto-increment screenshot number
const existing = readdirSync(dir).filter(f => f.startsWith('screenshot-'));
const nums = existing.map(f => parseInt(f.match(/screenshot-(\d+)/)?.[1] || '0'));
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width, height });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 1500)); // wait for animations

const path = join(dir, filename);
await page.screenshot({ path, fullPage: true, type: 'png' });

// If file > 4MB, retake as JPEG with quality reduction
const { statSync } = await import('fs');
const stat = statSync(path);
if (stat.size > 4 * 1024 * 1024) {
  const jpgPath = path.replace('.png', '.jpg');
  await page.screenshot({ path: jpgPath, fullPage: true, type: 'jpeg', quality: 70 });
  const { unlinkSync } = await import('fs');
  unlinkSync(path);
  console.log(`Screenshot saved: ${jpgPath} (compressed)`);
} else {
  console.log(`Screenshot saved: ${path}`);
}

await browser.close();
