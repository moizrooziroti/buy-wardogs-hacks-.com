#!/usr/bin/env node
/**
 * Import Delta Force user assets from project root (favicon-logo..png, logo..png,
 * hero-video..webm, hero-image..webp, screenshot-N..webp) into public/ paths
 * expected by the Warzone master template.
 *
 * Usage: node scripts/import-delta-force-assets.mjs
 */
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imagesDir = path.join(ROOT, 'public', 'images');
const publicDir = path.join(ROOT, 'public');
const videosDir = path.join(publicDir, 'videos');

const BG = { r: 13, g: 10, b: 20, alpha: 1 }; // #0D0A14 — brand.theme.bg
const CONTENT_WIDTHS = [480, 640, 960, 1024, 1199];
const WEBP = { quality: 82, effort: 6, smartSubsample: true };

async function findRootFile(prefix) {
	const entries = await readdir(ROOT);
	const hit = entries.find((name) => name.startsWith(`${prefix}..`));
	if (!hit) throw new Error(`Missing root asset: ${prefix}..* (expected e.g. ${prefix}..webp)`);
	return path.join(ROOT, hit);
}

async function encodeWebp(input, width, options = WEBP) {
	const meta = await sharp(input).metadata();
	const nativeWidth = meta.width ?? width;
	const targetWidth = Math.min(width, nativeWidth);
	const height = Math.round(((meta.height ?? 1080) / nativeWidth) * targetWidth);
	return sharp(input)
		.resize(targetWidth, height, { fit: 'inside', withoutEnlargement: true })
		.webp(options)
		.toBuffer();
}

async function writeResponsive(baseName, input) {
	const fullPath = path.join(imagesDir, `${baseName}.webp`);
	const fullBuf = await sharp(input).webp({ quality: 85, effort: 6 }).toBuffer();
	await writeFile(fullPath, fullBuf);
	for (const w of CONTENT_WIDTHS) {
		const buf = await encodeWebp(input, w);
		await writeFile(path.join(imagesDir, `${baseName}-${w}w.webp`), buf);
	}
	console.log(`  ✓ ${baseName}.webp (+ ${CONTENT_WIDTHS.length} variants)`);
}

async function importScreenshots() {
	for (let n = 1; n <= 12; n += 1) {
		const src = await findRootFile(`screenshot-${n}`).catch(() => null);
		if (!src) {
			console.warn(`  ⚠ screenshot-${n}..* not found — skipping`);
			continue;
		}
		const id = String(n).padStart(2, '0');
		await writeResponsive(`warzone-screenshot-${id}`, src);
	}
}

async function importHeroImage() {
	const src = await findRootFile('hero-image');
	await writeResponsive('warzone-cheats-hero', src);
	await writeResponsive('warzone-hero-poster', src);
	const heroCrop = await sharp(src).webp({ quality: 88, effort: 6 }).toBuffer();
	await writeFile(path.join(imagesDir, 'warzone-cheats-hero-4k.webp'), heroCrop);
	console.log('  ✓ hero image → warzone-cheats-hero + poster');
}

async function importHeroVideo() {
	const src = await findRootFile('hero-video');
	await mkdir(videosDir, { recursive: true });
	const dest = path.join(videosDir, 'hero.webm');
	await copyFile(src, dest);
	console.log(`  ✓ hero video → ${path.relative(ROOT, dest)}`);
}

async function importFaviconAndLogo() {
	const faviconSrc = await findRootFile('favicon-logo');
	const logoSrc = await findRootFile('logo').catch(() => faviconSrc);

	const faviconPng512 = await sharp(faviconSrc)
		.resize(512, 512, { fit: 'contain', background: { ...BG, alpha: 0 } })
		.png()
		.toBuffer();

	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon.png'),
		await sharp(faviconPng512).png().toBuffer(),
	);
	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon.webp'),
		await sharp(faviconPng512).webp({ quality: 92, effort: 6 }).toBuffer(),
	);
	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon-128.webp'),
		await sharp(faviconPng512).resize(128, 128, { fit: 'contain', background: { ...BG, alpha: 0 } }).webp({ quality: 90 }).toBuffer(),
	);
	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon-512.webp'),
		await sharp(faviconPng512).webp({ quality: 92 }).toBuffer(),
	);

	const navMaster = await sharp(logoSrc).png().toBuffer();
	await writeFile(path.join(imagesDir, 'delta-force-cheats-logo.png'), navMaster);
	await writeFile(
		path.join(imagesDir, 'delta-force-cheats-logo.webp'),
		await sharp(navMaster).webp({ quality: 95, effort: 6, nearLossless: true }).toBuffer(),
	);

	const faviconSizes = [
		{ name: 'favicon-16x16.png', size: 16 },
		{ name: 'favicon-32x32.png', size: 32 },
		{ name: 'apple-touch-icon.png', size: 180 },
		{ name: 'favicon.png', size: 192 },
	];
	for (const { name, size } of faviconSizes) {
		await writeFile(
			path.join(publicDir, name),
			await sharp(faviconPng512)
				.resize(size, size, { fit: 'contain', background: { ...BG, alpha: 0 } })
				.png()
				.toBuffer(),
		);
	}
	await writeFile(
		path.join(publicDir, 'favicon.ico'),
		await sharp(faviconPng512).resize(32, 32, { fit: 'contain', background: BG }).png().toBuffer(),
	);
	const svgBase64 = (
		await sharp(faviconPng512).resize(512, 512, { fit: 'contain', background: BG }).png().toBuffer()
	).toString('base64');
	const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><image width="512" height="512" href="data:image/png;base64,${svgBase64}"/></svg>`;
	await writeFile(path.join(publicDir, 'favicon.svg'), faviconSvg);
	console.log('  ✓ favicon-logo → site icon + public favicons');
}

await mkdir(imagesDir, { recursive: true });
console.log('Importing Delta Force assets from project root…');
try {
	await importHeroVideo();
} catch {
	console.log('  (skip hero video — image-only hero)');
}
await importHeroImage();
await importScreenshots();
await importFaviconAndLogo();
console.log('Done.');
