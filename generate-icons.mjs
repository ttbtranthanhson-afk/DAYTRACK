import sharp from 'sharp';
import fs from 'fs';

const svgIcon = (size) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" rx="${size * 0.18}" fill="#3b82f6"/>
  <rect x="${size*0.2}" y="${size*0.15}" width="${size*0.6}" height="${size*0.05}" rx="${size*0.025}" fill="white" opacity="0.9"/>
  <rect x="${size*0.28}" y="${size*0.30}" width="${size*0.44}" height="${size*0.06}" rx="${size*0.03}" fill="white"/>
  <rect x="${size*0.28}" y="${size*0.42}" width="${size*0.3}" height="${size*0.06}" rx="${size*0.03}" fill="white"/>
  <rect x="${size*0.28}" y="${size*0.54}" width="${size*0.38}" height="${size*0.06}" rx="${size*0.03}" fill="white"/>
  <circle cx="${size*0.75}" cy="${size*0.75}" r="${size*0.18}" fill="#22c55e"/>
  <path d="M${size*0.66} ${size*0.75} L${size*0.73} ${size*0.82} L${size*0.84} ${size*0.68}" stroke="white" stroke-width="${size*0.04}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
</svg>`);

fs.mkdirSync('public', { recursive: true });

await sharp(svgIcon(192)).resize(192, 192).png().toFile('public/pwa-192x192.png');
await sharp(svgIcon(512)).resize(512, 512).png().toFile('public/pwa-512x512.png');

console.log('✓ Icons created: public/pwa-192x192.png, public/pwa-512x512.png');
