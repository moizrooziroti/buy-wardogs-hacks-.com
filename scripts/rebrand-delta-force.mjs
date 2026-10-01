#!/usr/bin/env node
/**
 * One-time Warzone → Delta Force rebrand across template text files.
 * Run from project root: node scripts/rebrand-delta-force.mjs
 */
import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SCRIPT_NAME = 'rebrand-delta-force.mjs';

const SKIP_DIRS = new Set(['node_modules', 'dist', '.git', '.astro']);

const WALK_ROOTS = [
	path.join(ROOT, 'src'),
	path.join(ROOT, 'scripts', 'i18n-data'),
	path.join(ROOT, 'public'),
	path.join(ROOT, 'functions'),
];

const ROOT_FILES = [
	path.join(ROOT, 'astro.config.mjs'),
	path.join(ROOT, 'package.json'),
	path.join(ROOT, 'wrangler.toml'),
];

/** Ordered — most specific first. */
const STRING_REPLACEMENTS = [
	[
		'https://zadeyo.com/go/UMAIR?to=%2Fproducts%2Fwarzone',
		'https://zadeyo.com/go/MOIZ?to=%2Fproducts%2Fdelta-force',
	],
	['https://hacksforwarzone.com', 'https://deltaforcehack.org'],
	['https://cheatsforwarzone.com', 'https://deltaforcehack.org'],
	['http://cheatsforwarzone.com', 'https://deltaforcehack.org'],
	['support@hacksforwarzone.com', 'support@deltaforcehack.org'],
	['support@cheatsforwarzone.com', 'support@deltaforcehack.org'],
	['cheatsforwarzone.com', 'deltaforcehack.org'],
	['hacksforwarzone.com', 'deltaforcehack.org'],
	['Call of Duty: Warzone', 'Delta Force'],
	['Warzone Cheats', 'Delta Force Cheats'],
	['Warzone Hacks', 'Delta Force Hacks'],
	['warzone cheats', 'delta force cheats'],
	['warzone cheat', 'delta force cheat'],
	['warzone hacks', 'delta force hacks'],
	['warzone hack', 'delta force hack'],
	['Warzone cheats', 'Delta Force cheats'],
	['Warzone hacks', 'Delta Force hacks'],
	['Warzone hack', 'Delta Force hack'],
	['Warzone ESP', 'Delta Force ESP'],
	['Warzone Aimbot', 'Delta Force Aimbot'],
	['warzone esp', 'delta force esp'],
	['warzone aimbot', 'delta force aimbot'],
	['warzone wallhack', 'delta force wallhack'],
	['warzone soft aim', 'delta force soft aim'],
	['warzone mod menu', 'delta force mod menu'],
	['warzone radar', 'delta force radar'],
	['Ricochet', 'ACE'],
	['ricochet', 'ace'],
	['Warzone Forums', 'Delta Force Forums'],
];

const PATH_REPLACEMENTS = [
	['/warzone-esp/', '/esp/'],
	['/warzone-aimbot/', '/aimbot/'],
	['/warzone-cheats/', '/cheats/'],
	['/warzone-radar-hack/', '/radar/'],
	['/warzone-cheats-2026/', '/2026/'],
	['/ricochet-bypass/', '/ricochet/'],
	['/undetected-warzone-cheats/', '/undetected/'],
	['/warzone-wallhack/', '/wallhack/'],
];

/** Remaining Warzone / warzone — skip identifiers and asset paths listed in spec. */
const LOWER_WARZONE_RE = /(?<![-.\w])warzone(?!Images)(?![-.\w.])/g;

const BINARY_EXT = /\.(png|jpe?g|webp|gif|ico|svg|woff2?|mp4|webm|avif|pdf|zip)$/i;

async function walk(dir, files = []) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) {
			if (entry.name === 'images' && full.replace(/\\/g, '/').includes('/public/')) continue;
			await walk(full, files);
		} else {
			files.push(full);
		}
	}
	return files;
}

function shouldProcess(file) {
	const rel = path.relative(ROOT, file).replace(/\\/g, '/');
	if (path.basename(file) === SCRIPT_NAME) return false;
	if (rel.startsWith('public/images/')) return false;
	if (BINARY_EXT.test(file)) return false;
	return true;
}

function applyReplacements(text) {
	for (const [from, to] of STRING_REPLACEMENTS) {
		text = text.split(from).join(to);
	}
	for (const [from, to] of PATH_REPLACEMENTS) {
		text = text.split(from).join(to);
	}
	text = text.replace(/\bWarzone\b/g, 'Delta Force');
	text = text.replace(LOWER_WARZONE_RE, 'delta force');
	return text;
}

async function collectFiles() {
	const files = [...ROOT_FILES];
	for (const root of WALK_ROOTS) {
		try {
			await stat(root);
			await walk(root, files);
		} catch {
			// missing root — skip
		}
	}
	return [...new Set(files)].filter(shouldProcess);
}

let changed = 0;
const files = await collectFiles();

for (const file of files) {
	let text;
	try {
		text = await readFile(file, 'utf8');
	} catch {
		continue;
	}
	if (text.includes('\u0000')) continue;

	const next = applyReplacements(text);
	if (next !== text) {
		await writeFile(file, next, 'utf8');
		changed++;
		console.log('updated', path.relative(ROOT, file));
	}
}

console.log(`\nrebrand-delta-force: ${changed} file(s) updated`);
