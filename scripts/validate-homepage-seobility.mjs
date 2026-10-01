#!/usr/bin/env node
/**
 * Homepage checks aligned with Seobility on-page signals.
 * Run after `npm run build` (postbuild).
 */
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const indexHtml = path.join(root, 'dist', 'index.html');

function decodeHtml(text) {
	return text
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&quot;/g, '"')
		.replace(/&#39;/g, "'");
}

function fail(msg) {
	console.error(`validate-homepage-seobility: ${msg}`);
	process.exit(1);
}

if (!existsSync(indexHtml)) {
	fail('dist/index.html missing — run npm run build first');
}

const html = readFileSync(indexHtml, 'utf8');
const title = decodeHtml(html.match(/<title>([^<]*)<\/title>/i)?.[1]?.trim() ?? '');
const desc = decodeHtml(
	html.match(/<meta\s+name="description"\s+content="([^"]*)"/i)?.[1]?.trim() ??
		html.match(/<meta\s+content="([^"]*)"\s+name="description"/i)?.[1]?.trim() ??
		'',
);
const h1Texts = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
	decodeHtml(m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()),
);

if (h1Texts.length !== 1) fail(`expected 1 H1, found ${h1Texts.length}`);
if (h1Texts[0].length < 20) fail(`H1 too short (${h1Texts[0].length} chars): "${h1Texts[0]}"`);
if (title.length < 30 || title.length > 60) fail(`title length ${title.length} (want 30–60)`);
if (desc.length < 140 || desc.length > 160) fail(`meta description length ${desc.length} (want 140–160)`);

const banned = [
	/\bbattle royale\b/i,
	/\bverdansk\b/i,
	/\bwarzone cheats\b/i,
	/\bcheatsforwarzone\b/i,
];
for (const re of banned) {
	if (re.test(desc)) fail(`meta description contains blocked term: ${re}`);
}

const faqBlock = html.match(/"@type":"FAQPage"[\s\S]*?"mainEntity":\[[\s\S]*?\]\}/)?.[0] ?? '';
if (faqBlock && /\bDelta Force Hacks\b/i.test(faqBlock)) {
	fail('FAQ schema still uses legacy “Delta Force Hacks” copy');
}
if (faqBlock && /\bbattle royale\b/i.test(faqBlock)) {
	fail('FAQ schema still mentions Battle Royale');
}

const dup = spawnSync(process.execPath, ['scripts/audit-duplicate-anchor-text.mjs', indexHtml], {
	cwd: root,
	encoding: 'utf8',
});
if (dup.status !== 0) {
	console.error(dup.stdout || dup.stderr);
	fail('duplicate anchor audit failed');
}
const dupLine = (dup.stdout || '').split('\n').find((l) => l.includes('anchor labels'));
const dupCount = Number(dupLine?.match(/:\s*(\d+)/)?.[1] ?? NaN);
if (Number.isFinite(dupCount) && dupCount > 0) {
	fail(`${dupCount} duplicate anchor labels on homepage`);
}

console.log(
	`validate-homepage-seobility: OK — H1 ${h1Texts[0].length} chars, title ${title.length}, description ${desc.length}, duplicate anchors 0`,
);
