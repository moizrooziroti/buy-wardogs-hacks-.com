#!/usr/bin/env node
/**
 * Build homepage hero WebP + responsive variants from a source image (JPG/PNG/WebP).
 * Replaces warzone-cheats-hero* and warzone-hero-poster* paths used by the template.
 */
import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const imagesDir = path.join(ROOT, 'public', 'images');
const WIDTHS = [480, 640, 1024, 1199];
const BASES = ['warzone-cheats-hero', 'warzone-hero-poster'];

function qualityFor(width) {
	if (width <= 480) return 78;
	if (width <= 640) return 84;
	if (width <= 1024) return 88;
	return 90;
}

async function writeResponsive(baseName, input) {
	const meta = await sharp(input).metadata();
	const nativeWidth = meta.width ?? 1199;

	const fullBuf = await sharp(input)
		.webp({ quality: 90, effort: 6, smartSubsample: true })
		.toBuffer();
	await writeFile(path.join(imagesDir, `${baseName}.webp`), fullBuf);

	for (const w of WIDTHS) {
		const targetWidth = Math.min(w, nativeWidth);
		const height = Math.round(((meta.height ?? 1080) / nativeWidth) * targetWidth);
		const buf = await sharp(input)
			.resize(targetWidth, height, { fit: 'inside', withoutEnlargement: true })
			.webp({ quality: qualityFor(w), effort: 6, smartSubsample: true })
			.toBuffer();
		await writeFile(path.join(imagesDir, `${baseName}-${w}w.webp`), buf);
	}
	console.log(`  ✓ ${baseName}.webp (+ ${WIDTHS.length} widths)`);
}

import { readdir } from 'node:fs/promises';

async function findRootHeroSource() {
	const files = await readdir(ROOT);
	const match = files.find((f) => /^hero-image/i.test(f));
	if (!match) throw new Error('Pass image path or add hero-image.* to project root');
	return path.join(ROOT, match);
}

const src = process.argv[2] ? path.resolve(process.argv[2]) : await findRootHeroSource();

await mkdir(imagesDir, { recursive: true });
const meta = await sharp(src).metadata();
console.log(`Source: ${src} (${meta.width}×${meta.height})`);

for (const base of BASES) {
	await writeResponsive(base, src);
}

const masterHero = path.join(imagesDir, 'warzone-cheats-hero.webp');
await copyFile(masterHero, path.join(imagesDir, 'hero-banner.webp'));

const lcp = await sharp(masterHero).metadata();
console.log(`LCP master: ${lcp.width}×${lcp.height} — keep responsive-images.ts heroWidth/heroHeight in sync.`);
