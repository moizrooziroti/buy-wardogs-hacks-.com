#!/usr/bin/env node
/**
 * Cloudflare Workers static assets must be ≤ 25 MiB per file.
 * Re-encodes public/videos/hero.webm when oversized (uses ffmpeg-static on CI).
 *
 * Usage:
 *   node scripts/ensure-cloudflare-asset-limits.mjs          # compress public hero if needed
 *   node scripts/ensure-cloudflare-asset-limits.mjs --dist   # validate dist/ after build
 */
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
/** Cloudflare limit is 25 MiB; stay under with margin. */
const MAX_BYTES = 24 * 1024 * 1024;
const HERO_REL = path.join('videos', 'hero.webm');

function formatMiB(bytes) {
	return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

async function resolveFfmpeg() {
	try {
		const mod = await import('ffmpeg-static');
		if (mod.default && existsSync(mod.default)) return mod.default;
	} catch {
		/* optional dependency path */
	}
	return 'ffmpeg';
}

function encodeHero(ffmpeg, input, output, crf) {
	execFileSync(
		ffmpeg,
		[
			'-y',
			'-i',
			input,
			'-an',
			'-c:v',
			'libvpx-vp9',
			'-crf',
			String(crf),
			'-b:v',
			'0',
			'-deadline',
			'good',
			'-cpu-used',
			'2',
			'-row-mt',
			'1',
			'-pix_fmt',
			'yuv420p',
			'-vf',
			'scale=min(1920\\,iw):-2:flags=lanczos',
			output,
		],
		{ stdio: 'inherit' },
	);
}

async function compressHeroIfNeeded(heroPath) {
	if (!existsSync(heroPath)) {
		console.log('[cloudflare-assets] no hero.webm — skip');
		return;
	}
	const size = statSync(heroPath).size;
	if (size <= MAX_BYTES) {
		console.log(`[cloudflare-assets] OK ${HERO_REL} (${formatMiB(size)})`);
		return;
	}

	const ffmpeg = await resolveFfmpeg();
	const tmp = `${heroPath}.cloudflare-tmp.webm`;
	console.log(
		`[cloudflare-assets] ${HERO_REL} is ${formatMiB(size)} — re-encoding for 25 MiB Workers limit…`,
	);

	const crfSteps = [36, 38, 40, 42, 45];
	let lastSize = size;
	for (const crf of crfSteps) {
		if (existsSync(tmp)) unlinkSync(tmp);
		encodeHero(ffmpeg, heroPath, tmp, crf);
		lastSize = statSync(tmp).size;
		console.log(`[cloudflare-assets]   crf ${crf} → ${formatMiB(lastSize)}`);
		if (lastSize <= MAX_BYTES) {
			unlinkSync(heroPath);
			renameSync(tmp, heroPath);
			console.log(`[cloudflare-assets] ✓ ${HERO_REL} now ${formatMiB(lastSize)}`);
			return;
		}
	}
	if (existsSync(tmp)) unlinkSync(tmp);
	throw new Error(
		`[cloudflare-assets] Could not shrink ${HERO_REL} below ${formatMiB(MAX_BYTES)} (last ${formatMiB(lastSize)}). Shorten the source video or lower quality manually.`,
	);
}

function walkValidateDir(dir, oversize) {
	for (const name of readdirSync(dir, { withFileTypes: true })) {
		const full = path.join(dir, name.name);
		if (name.isDirectory()) walkValidateDir(full, oversize);
		else if (name.isFile()) {
			const sz = statSync(full).size;
			if (sz > 25 * 1024 * 1024) oversize.push({ full, sz });
		}
	}
}

function validateDist() {
	const dist = path.join(ROOT, 'dist');
	if (!existsSync(dist)) {
		console.log('[cloudflare-assets] dist/ missing — skip validate');
		return;
	}
	const oversize = [];
	walkValidateDir(dist, oversize);
	if (oversize.length === 0) {
		console.log('[cloudflare-assets] dist/ OK — all assets ≤ 25 MiB');
		return;
	}
	for (const { full, sz } of oversize) {
		console.error(`[cloudflare-assets] TOO LARGE: ${path.relative(ROOT, full)} (${formatMiB(sz)})`);
	}
	process.exit(1);
}

const modeDist = process.argv.includes('--dist');
if (modeDist) {
	validateDist();
} else {
	await compressHeroIfNeeded(path.join(ROOT, 'public', HERO_REL));
}
