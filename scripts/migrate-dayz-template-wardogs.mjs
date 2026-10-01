#!/usr/bin/env node
/**
 * Replace legacy multi-locale template with buywardogshacks.com stack, retargeted to WARDOGS.
 * Requires .tmp-dayzcheats (git clone of Stellarhamza/buywardogshacks.com).
 */
import { cp, rm, mkdir, copyFile, readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const TPL = path.join(ROOT, '.tmp-dayzcheats');

async function pathExists(p) {
	try {
		const { access } = await import('node:fs/promises');
		await access(p);
		return true;
	} catch {
		return false;
	}
}

async function mirrorDir(from, to) {
	await rm(to, { recursive: true, force: true });
	await mkdir(path.dirname(to), { recursive: true });
	await cp(from, to, { recursive: true });
}

async function replaceInTree(dir, pairs) {
	const entries = await readdir(dir, { withFileTypes: true });
	for (const ent of entries) {
		const full = path.join(dir, ent.name);
		if (ent.isDirectory()) {
			if (ent.name === 'node_modules') continue;
			await replaceInTree(full, pairs);
			continue;
		}
		if (!/\.(ts|tsx|astro|css|mjs|js|json|md)$/i.test(ent.name)) continue;
		let text = await readFile(full, 'utf8');
		let next = text;
		for (const [from, to] of pairs) {
			next = next.split(from).join(to);
		}
		if (next !== text) await writeFile(full, next);
	}
}

async function main() {
	if (!(await pathExists(TPL))) {
		throw new Error('Run: git clone --depth 1 https://github.com/Stellarhamza/buywardogshacks.com.git .tmp-dayzcheats');
	}

	console.log('Mirroring buywardogshacks.com src + workers + configs…');
	await mirrorDir(path.join(TPL, 'src'), path.join(ROOT, 'src'));
	await mirrorDir(path.join(TPL, 'workers'), path.join(ROOT, 'workers'));

	for (const file of [
		'astro.config.mjs',
		'tailwind.config.js',
		'postcss.config.js',
		'tsconfig.json',
		'.oxlintrc.json',
	]) {
		await copyFile(path.join(TPL, file), path.join(ROOT, file));
	}

	const pkg = JSON.parse(await readFile(path.join(TPL, 'package.json'), 'utf8'));
	pkg.name = 'buywardogshacks-com';
	await writeFile(path.join(ROOT, 'package.json'), `${JSON.stringify(pkg, null, 2)}\n`);

	await mirrorDir(path.join(TPL, 'public'), path.join(ROOT, 'public'));

	const heroCandidates = [
		path.join(ROOT, 'public', 'images', 'warzone-cheats-hero.webp'),
		path.join(ROOT, 'hero-image..webp'),
	];
	let heroSrc = heroCandidates.find(async () => false);
	for (const c of heroCandidates) {
		if (await pathExists(c)) {
			heroSrc = c;
			break;
		}
	}
	if (heroSrc) {
		await mkdir(path.join(ROOT, 'public', 'media'), { recursive: true });
		const dest = path.join(ROOT, 'public', 'media', 'wardogs-hero-full.webp');
		await sharp(heroSrc).webp({ quality: 90, effort: 6 }).toFile(dest);
		await copyFile(dest, path.join(ROOT, 'public', 'media', 'wardogs-cover.webp'));
		console.log('  ✓ WARDOGS hero → public/media/wardogs-hero-full.webp');
	}

	const pairs = [
		['https://buywardogshacks.com', 'https://buywardogshacks.com'],
		['buywardogshacks.com', 'buywardogshacks.com'],
		['WAR DOGS HACKS', 'WAR DOGS HACKS'],
		['WARDOGS', 'WARDOGS'],
		['WARDOGS hacks', 'WARDOGS hacks'],
		['WARDOGS hack', 'WARDOGS hack'],
		['WARDOGS hacks', 'WARDOGS hacks'],
		['WARDOGS hack', 'WARDOGS hack'],
		['WARDOGS Aimbot', 'WARDOGS Aimbot'],
		['WARDOGS ESP', 'WARDOGS ESP'],
		['WARDOGS ·', 'WARDOGS ·'],
		['WARDOGS player', 'WARDOGS player'],
		['WARDOGS ', 'WARDOGS '],
		['wardogs-cheats', 'wardogs-cheats'],
		['wardogs-cheats.jpg', 'wardogs-cheats.jpg'],
		['/wardogs-', '/wardogs-'],
		['wardogs-', 'wardogs-'],
		['WARDOGS_', 'WARDOGS_'],
		["slug: 'wardogs'", "slug: 'wardogs'"],
		['getGame(\'dayz\')', "getGame('wardogs')"],
		['guideSlug="wardogs-cheats"', 'guideSlug="wardogs-cheats"'],
		['VAC', 'VAC'],
		['vac', 'vac'],
		['Buy WAR DOGS HACKS', 'Buy WARDOGS Hacks'],
		['WARDOGS Reaper', 'WARDOGS'],
		['WD', 'WD'],
		['/products/wardogs-cheats', '/products/wardogs'],
		['MOIZ', 'MOIZ'],
		// paths
		['/media/wardogs-', '/media/wardogs-'],
	];

	await replaceInTree(path.join(ROOT, 'src'), pairs);
	await replaceInTree(path.join(ROOT, 'public'), pairs);
	await replaceInTree(path.join(ROOT, 'scripts'), pairs);

	const wrangler = `name = "buywardogshacks-com"
main = "workers/site.js"
compatibility_date = "2026-09-12"

[build]
command = "npm run build"

[[routes]]
pattern = "buywardogshacks.com"
custom_domain = true

[[routes]]
pattern = "www.buywardogshacks.com"
custom_domain = true

[assets]
directory = "./dist"
binding = "ASSETS"
not_found_handling = "404-page"
html_handling = "drop-trailing-slash"
run_worker_first = [
  "/*",
  "!/sitemap.xml",
  "!/robots.txt",
  "!/sitemap.css",
  "!/favicon.svg",
  "!/_astro/*",
  "!/media/*",
  "!/videos/*",
  "!/og/*",
]
`;
	await writeFile(path.join(ROOT, 'wrangler.toml'), wrangler);

	const astro = await readFile(path.join(ROOT, 'astro.config.mjs'), 'utf8');
	await writeFile(
		path.join(ROOT, 'astro.config.mjs'),
		astro.replace("site: 'https://buywardogshacks.com'", "site: 'https://buywardogshacks.com'"),
	);

	// Rename product page file
	const oldPage = path.join(ROOT, 'src', 'pages', 'wardogs-cheats.astro');
	const newPage = path.join(ROOT, 'src', 'pages', 'wardogs-cheats.astro');
	if (await pathExists(oldPage)) {
		await rm(newPage, { force: true });
		await copyFile(oldPage, newPage);
		await rm(oldPage, { force: true });
	}

	// Copy template scripts (replace old script dir subset)
	await mkdir(path.join(ROOT, 'scripts'), { recursive: true });
	for (const f of await readdir(path.join(TPL, 'scripts'))) {
		await copyFile(path.join(TPL, 'scripts', f), path.join(ROOT, 'scripts', f));
	}

	const readme = `# WAR DOGS HACKS (buywardogshacks.com)

Static Astro site — [buywardogshacks.com](https://github.com/Stellarhamza/buywardogshacks.com) template stack, retargeted for **WARDOGS** hacks on Windows PC.

\`\`\`bash
npm install
npm run dev
npm run build
npx wrangler deploy
\`\`\`
`;
	await writeFile(path.join(ROOT, 'README.md'), readme);

	console.log('Done. Run: npm install && npm run build');
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
