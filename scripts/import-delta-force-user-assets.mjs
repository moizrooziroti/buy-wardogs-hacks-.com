#!/usr/bin/env node
/**
 * Import user assets from project root (logo..png, favicon-logo..png, hero-*, screenshot-*)
 * into public/ paths used by the template.
 */
import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const imagesDir = path.join(ROOT, 'public', 'images');
const videosDir = path.join(ROOT, 'public', 'videos');
const publicDir = path.join(ROOT, 'public');

const CONTENT_WIDTHS = [480, 640, 960, 1024, 1199];
const WEBP = { quality: 82, effort: 6, smartSubsample: true };

async function findRootAsset(prefix) {
	const files = await readdir(ROOT);
	const match = files.find((f) => f.toLowerCase().startsWith(prefix.toLowerCase()));
	if (!match) throw new Error(`Missing asset matching ${prefix}* in project root`);
	return path.join(ROOT, match);
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
	console.log(`  ✓ ${baseName}.webp (+ responsive)`);
}

async function writeFaviconFromSource(faviconSrc) {
	const meta = await sharp(faviconSrc).metadata();
	const w = meta.width ?? 512;
	const h = meta.height ?? 512;

	const png512 = await sharp(faviconSrc)
		.resize(512, 512, { fit: 'contain', background: { r: 13, g: 10, b: 20, alpha: 0 } })
		.png()
		.toBuffer();

	await writeFile(path.join(imagesDir, 'delta-force-site-icon.png'), png512);
	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon.webp'),
		await sharp(png512).webp({ quality: 92, effort: 6 }).toBuffer(),
	);
	await writeFile(
		path.join(imagesDir, 'delta-force-site-icon-mark.webp'),
		await sharp(png512).resize(128, 128).webp({ quality: 92, effort: 6 }).toBuffer(),
	);

	// Legacy template paths (content still references warzone-cheats-logo*)
	await writeFile(path.join(imagesDir, 'warzone-cheats-logo.png'), png512);
	await writeFile(
		path.join(imagesDir, 'warzone-cheats-logo.webp'),
		await sharp(png512).webp({ quality: 92, effort: 6 }).toBuffer(),
	);

	const navHeights = [360, 480, 560, 640, 720];
	for (const maxW of navHeights) {
		const height = Math.round(maxW * (h / w));
		const png = await sharp(faviconSrc)
			.resize(maxW, height, { fit: 'inside', withoutEnlargement: true })
			.png()
			.toBuffer();
		const suffix = maxW === 640 ? '' : `-${maxW}w`;
		await writeFile(path.join(imagesDir, `warzone-cheats-logo-nav${suffix}.png`), png);
	}

	const faviconSizes = [
		['favicon-16x16.png', 16],
		['favicon-32x32.png', 32],
		['apple-touch-icon.png', 180],
		['favicon.png', 192],
	];
	for (const [name, size] of faviconSizes) {
		await writeFile(
			path.join(publicDir, name),
			await sharp(faviconSrc)
				.resize(size, size, { fit: 'contain', background: { r: 13, g: 10, b: 20, alpha: 0 } })
				.png()
				.toBuffer(),
		);
	}
	await writeFile(
		path.join(publicDir, 'favicon.ico'),
		await sharp(faviconSrc).resize(32, 32, { fit: 'contain' }).png().toBuffer(),
	);
	console.log('  ✓ favicon + header icon from favicon-logo');
}

async function writeFullLogo(logoSrc) {
	const png = await sharp(logoSrc).png().toBuffer();
	await writeFile(path.join(imagesDir, 'delta-force-cheats-logo.png'), png);
	await writeFile(
		path.join(imagesDir, 'delta-force-cheats-logo.webp'),
		await sharp(png).webp({ quality: 92, effort: 6 }).toBuffer(),
	);
	console.log('  ✓ full logo asset');
}

async function importScreenshots() {
	const files = (await readdir(ROOT))
		.filter((f) => /^screenshot-\d+/i.test(f))
		.sort((a, b) => {
			const na = parseInt(a.match(/screenshot-(\d+)/i)?.[1] ?? '0', 10);
			const nb = parseInt(b.match(/screenshot-(\d+)/i)?.[1] ?? '0', 10);
			return na - nb;
		});

	for (const file of files) {
		const n = parseInt(file.match(/screenshot-(\d+)/i)?.[1] ?? '0', 10);
		if (!n) continue;
		const id = String(n).padStart(2, '0');
		await writeResponsive(`warzone-screenshot-${id}`, path.join(ROOT, file));
	}
	console.log(`  ✓ ${files.length} gameplay screenshots`);
}

async function main() {
	await mkdir(imagesDir, { recursive: true });
	await mkdir(videosDir, { recursive: true });

	const faviconSrc = await findRootAsset('favicon-logo');
	const logoSrc = await findRootAsset('logo');
	const heroImageSrc = await findRootAsset('hero-image');

	console.log('Importing Delta Force user assets…');
	await writeFaviconFromSource(faviconSrc);
	await writeFullLogo(logoSrc);
	await writeResponsive('warzone-cheats-hero', heroImageSrc);
	await writeResponsive('warzone-hero-poster', heroImageSrc);
	await importScreenshots();
	try {
		const heroVideoSrc = await findRootAsset('hero-video');
		await copyFile(heroVideoSrc, path.join(videosDir, 'hero.webm'));
		console.log('  ✓ hero.webm');
	} catch {
		console.log('  (skip hero video — image-only hero)');
	}
	console.log('Done.');
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
