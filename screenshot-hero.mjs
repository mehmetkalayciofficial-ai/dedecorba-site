import puppeteer from 'puppeteer';
import { mkdirSync } from 'fs';
import { join } from 'path';

const dir = './temporary screenshots';
mkdirSync(dir, { recursive: true });

const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();

// Desktop hero
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: join(dir, 'hero-desktop.png'), clip: { x: 0, y: 0, width: 1440, height: 900 } });
console.log('hero-desktop.png saved');

// Mobile hero
await page.setViewport({ width: 375, height: 812 });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle0', timeout: 15000 });
await new Promise(r => setTimeout(r, 2000));
await page.screenshot({ path: join(dir, 'hero-mobile.png'), clip: { x: 0, y: 0, width: 375, height: 812 } });
console.log('hero-mobile.png saved');

await browser.close();
