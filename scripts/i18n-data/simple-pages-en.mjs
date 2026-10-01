/**
 * English simple-page overrides — canonical EN for features, store, status, preview, etc.
 */
export const SIMPLE_PAGE_IDS = [
	'features',
	'pricing',
	'updates',
	'hacks',
	'warzone-esp',
	'warzone-aimbot',
	'radar',
	'setup',
	'support',
	'faq',
];

export const simplePagesEn = {
	features: {
		title: 'WARDOGS Features | WARDOGS hacks',
		description:
			'WARDOGS features for WARDOGS hacks — aimbot, silent aim, triggerbot, player ESP, class ESP, item ESP, and 2D/3D radar on Windows PC.',
		h1: 'Features',
		intro:
			'Full aimbot, player visuals, vehicle ESP, radar, misc toggles, and config save/load in one WARDOGS license on Windows PC.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'View store',
		ctaSecondaryHref: '/pricing/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'Aimbot Options',
				paragraphs: [
					'Silent aim and standard aimbot controls for WARDOGS firefights on Windows PC.',
					'Tune FOV, smoothing, bone selection, and visibility checks before you load.',
				],
				list: [
					'Enable Aimbot',
					'FOV',
					'Smooth',
					'Bone Selection',
					'Visible Check',
					'Prediction',
					'Draw FOV',
					'Draw Target Line',
				],
			},
			{
				h2: 'Player Visual Options',
				paragraphs: [
					'Player ESP overlays for squad reads, weapon info, and off-screen threats.',
					'Adjust max distance so the overlay stays clean in large maps.',
				],
				list: [
					'Box',
					'Skeleton',
					'Head Circle',
					'Health Bar',
					'Distance',
					'Name',
					'Team / Squad',
					'Weapon',
					'View Direction',
					'OOF Arrows',
					'Max Distance',
				],
			},
			{
				h2: 'Vehicle Visual Options',
				paragraphs: [
					'Track vehicles across the map with type and occupancy markers.',
					'Filter by distance so convoys and empty vehicles do not clutter the overlay.',
				],
				list: ['Vehicle ESP', 'Vehicle Type', 'Vehicle Distance', 'Occupied / Empty'],
			},
			{
				h2: 'Radar Options',
				paragraphs: [
					'2D radar for players and vehicles with adjustable range.',
					'Use radar range to match the map size you are playing on.',
				],
				list: ['2D Radar', 'Player Markers', 'Vehicle Markers', 'Radar Range'],
			},
			{
				h2: 'Misc Options',
				paragraphs: [
					'Combat comfort toggles and a custom crosshair when you want a cleaner HUD.',
					'Toggle no recoil and no spread only when you accept the extra risk in public matches.',
				],
				list: ['No Recoil', 'No Spread', 'Full Bright', 'Custom Crosshair'],
			},
			{
				h2: 'Config System (Save / Load)',
				paragraphs: [
					'Save and load profiles so your aimbot, ESP, and radar settings stay consistent between sessions.',
					'Name configs by play style — aggressive aim, minimal ESP, or radar-only scouting.',
				],
				list: ['Config System (Save / Load)'],
			},
		],
	},
	pricing: {
		title: 'WARDOGS Store | WARDOGS hacks',
		description:
			'WARDOGS store for WARDOGS hacks. Monthly access is $35 and lifetime is $150, with aimbot, ESP, radar, and instant worldwide delivery.',
		h1: 'Store',
		intro: 'Pick a plan. Same features on both. Instant delivery after payment.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'Setup guide',
		ctaSecondaryHref: '/setup/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'What you get',
				paragraphs: [
					'Full package access for Windows 10 / 11.',
					'Same aimbot, ESP, vehicle markers, and radar on monthly and lifetime plans.',
				],
				list: ['Aimbot, ESP, and radar', 'VAC status rebuilds while active', 'Digital delivery after checkout'],
			},
			{
				h2: 'Plans',
				paragraphs: [
					'Pick monthly to try first, or lifetime for one payment.',
					'Both plans unlock the same features after checkout.',
				],
				list: ['Monthly — $35 / 30 days', 'Lifetime — $150 one-time', 'Instant license by email'],
			},
			{
				h2: 'Before you buy',
				paragraphs: [
					'Read the refund policy if you need it. Join Discord with your order ID for help.',
					'Checkout goes to our secure store — monthly $35 or lifetime $150 with the same feature stack.',
				],
				list: [
					'<a href="/refund/">Refund policy</a>',
					'<a href="/faq/">FAQ</a>',
					'<a href="/support/">Support</a>',
				],
			},
		],
	},
	updates: {
		title: 'WARDOGS Status | WARDOGS hacks',
		description:
			'WARDOGS VAC status for WARDOGS hacks. Read clear versus Updating after Steam and Valve Anti-Cheat patches before you load.',
		h1: 'Status',
		intro: 'Check here after a WARDOGS or Valve Anti-Cheat (VAC) patch before you load.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'WARDOGS hacks overview',
		ctaSecondaryHref: '/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'Current status',
				paragraphs: [
					'We post a new note here when a WARDOGS or VAC patch needs a rebuild. Check clear versus Updating before you load.',
					'If Status is green, you can match. If we are rebuilding, wait for the next note.',
				],
				list: [
					'Check this page before every session after a Steam patch',
					'Monthly and lifetime licenses get rebuilds while active',
					'No cheat stays undetected forever — status first, then play',
				],
			},
			{
				h2: 'After a patch',
				paragraphs: [
					'Wait for our rebuild note, then launch. Do not play on an old build after a big Steam or VAC-related update.',
					'Cross-check WARDOGS Steam news if the game client updated overnight while Status still shows Updating.',
				],
				list: ['Read the latest status note', 'Follow setup if something fails', 'Discord support with your order ID'],
			},
			{
				h2: 'Important',
				paragraphs: [
					'No cheat is 100% safe forever. Stay updated and use safe settings.',
					'When Status shows Updating, wait for the rebuild note before you load WARDOGS.',
				],
				list: ['Status first, then play', '<a href="/support/">Support</a> for license help'],
			},
		],
	},
	hacks: {
		title: 'WARDOGS Preview | WARDOGS hacks',
		description:
			'Preview silent aim, ESP, and radar for WARDOGS. See how WARDOGS hacks group aim and visuals before you checkout.',
		h1: 'WARDOGS hacks — preview',
		intro:
			'WARDOGS hacks add aimbot, silent aim, player ESP, vehicle ESP, and radar on top of the base game. Preview the stack and check VAC status before you checkout.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'View features',
		ctaSecondaryHref: '/features/',
		galleryTitle: 'WARDOGS hacks in action',
		sections: [
			{
				h2: 'What are wardogs hacks?',
				paragraphs: [
					'WARDOGS hacks are third-party tools that give you extra information and combat assist during matches.',
					'WAR DOGS HACKS bundles aimbot, ESP, vehicle ESP, and radar in one license for Windows PC.',
				],
			},
			{
				h2: 'What WAR DOGS HACKS includes',
				paragraphs: [
					'One license covers aimbot with prediction, player visuals, vehicle ESP, 2D radar, misc toggles, and config save/load.',
					'Monthly ($35) and lifetime ($150) include rebuilds after Steam and VAC patches.',
				],
				list: [
					'Aimbot and silent aim',
					'Player ESP with squad and weapon tags',
					'Vehicle ESP with occupancy markers',
					'2D radar for players and vehicles',
					'VAC status notes after patches',
				],
			},
			{
				h2: 'Module guides',
				paragraphs: [
					'Each tool has its own page if you want details before checkout.',
					'Start with Features for the full control list, then open ESP or Aimbot for tuning tips.',
				],
				list: [
					'<a href="/esp/">WARDOGS ESP</a>',
					'<a href="/aimbot/">WARDOGS aimbot</a>',
					'<a href="/radar/">Radar overlay</a>',
					'<a href="/features/">Full feature list</a>',
				],
			},
		],
	},
	'warzone-esp': {
		title: 'WARDOGS ESP | Player overlays | WAR DOGS HACKS',
		description:
			'WARDOGS ESP — player boxes, skeleton, squad tags, weapons, and distance on Windows PC. Bundled with aimbot and radar.',
		h1: 'ESP',
		intro:
			'See players, squads, and weapons with configurable player visuals during WARDOGS matches. Part of the same WAR DOGS HACKS license.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'WARDOGS hacks overview',
		ctaSecondaryHref: '/',
		galleryTitle: 'ESP in match',
		sections: [
			{
				h2: 'What ESP shows',
				paragraphs: [
					'Boxes, skeleton, health bars, names, weapons, and OOF arrows with max distance filters.',
					'Vehicle ESP shows type, distance, and occupied versus empty states when you rotate across the map.',
				],
				list: ['Player ESP', 'Team / squad tags', 'Vehicle ESP markers'],
			},
			{
				h2: 'When to use it',
				paragraphs: [
					'Keep large-map fights readable without flooding the screen.',
					'Tune max distance and squad filters before you load into a full server.',
				],
				list: ['Tune max distance', 'Filter by squad', 'Pair with radar'],
			},
			{
				h2: 'Next steps',
				paragraphs: [
					'ESP is included with aimbot and radar in one plan.',
					'Compare monthly and lifetime options on the store before checkout.',
				],
				list: [
					'<a href="/">Full product</a>',
					'<a href="/features/">All features</a>',
					'<a href="/pricing/">Store</a>',
				],
			},
		],
	},
	'warzone-aimbot': {
		title: 'WARDOGS Aimbot | Silent aim & FOV | WAR DOGS HACKS',
		description:
			'WARDOGS aimbot with silent aim, FOV, smooth, bone selection, and visible check on Windows PC. ESP and radar included.',
		h1: 'Aimbot',
		intro: 'Silent aim and aimbot controls you can tune for WARDOGS. Included in the same WAR DOGS HACKS license.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'WARDOGS hacks overview',
		ctaSecondaryHref: '/',
		galleryTitle: 'Aimbot view',
		sections: [
			{
				h2: 'Controls',
				paragraphs: [
					'Set FOV, smoothness, bone selection, and visible check before you load.',
					'Use prediction and target-line overlays when you want clearer feedback in long-range fights.',
				],
				list: ['Enable Aimbot', 'Prediction', 'Draw FOV', 'Draw Target Line'],
			},
			{
				h2: 'Play styles',
				paragraphs: [
					'Keep settings subtle for longer sessions.',
					'Raise FOV or smooth only when you accept more visible aim movement.',
				],
				list: ['Silent aim profiles', 'Bone selection', 'Works with ESP'],
			},
			{
				h2: 'Next steps',
				paragraphs: [
					'Aimbot ships with ESP and radar in one license.',
					'Read the Features page for the full aimbot option list.',
				],
				list: [
					'<a href="/">Full product</a>',
					'<a href="/features/">All features</a>',
					'<a href="/pricing/">Store</a>',
				],
			},
		],
	},
	radar: {
		title: 'WARDOGS Radar | 2D player & vehicle map | WAR DOGS HACKS',
		description:
			'2D radar with player and vehicle markers for WARDOGS on Windows PC. Bundled with ESP and aimbot in one license.',
		h1: 'Radar',
		intro: '2D radar for players and vehicles outside your view. Included in the same WAR DOGS HACKS license.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'WARDOGS hacks overview',
		ctaSecondaryHref: '/',
		galleryTitle: 'Radar overlay',
		sections: [
			{
				h2: 'What it shows',
				paragraphs: [
					'Player and vehicle markers with adjustable radar range.',
					'Pair radar with player ESP so off-screen threats and occupied vehicles stay readable.',
				],
				list: ['2D Radar', 'Player Markers', 'Vehicle Markers', 'Radar Range'],
			},
			{
				h2: 'With ESP',
				paragraphs: [
					'Use radar for threats you cannot see yet. Use ESP when you push.',
					'Vehicle markers help you avoid occupied convoys while rotating.',
				],
				list: [
					'<a href="/esp/">ESP guide</a>',
					'<a href="/">Full product</a>',
					'<a href="/pricing/">Store</a>',
				],
			},
			{
				h2: 'Next steps',
				paragraphs: [
					'Radar is bundled with aimbot and ESP in one WARDOGS license.',
					'Check VAC status on the Status page after Steam patches.',
				],
				list: ['<a href="/updates/">Status</a>', '<a href="/setup/">Setup</a>'],
			},
		],
	},
	setup: {
		title: 'WARDOGS Setup | WARDOGS hacks',
		description:
			'Learn how WARDOGS hacks group aimbot, ESP, and radar, which settings matter, and what to check before you load on Windows PC.',
		h1: 'Setup',
		intro: 'Install WAR DOGS HACKS on Windows PC after you buy. Follow these short steps.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'Check status',
		ctaSecondaryHref: '/updates/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'Before you install',
				paragraphs: [
					'Buy a plan first. You get a license by email.',
					'Use Windows 10 or 11 and close overlays that hook into the game before you install.',
				],
				list: ['Windows 10 / 11 PC', 'Disable conflicting overlays', 'Have your order email ready'],
			},
			{
				h2: 'Install steps',
				paragraphs: [
					'Run the loader as admin, paste your license, then launch WARDOGS.',
					'Check Status after Steam patches before your first session with a new build.',
				],
				list: ['Download the loader from your delivery email', 'Paste license key', 'Launch the game'],
			},
			{
				h2: 'If something fails',
				paragraphs: [
					'Check Status after a patch. Join Discord with your order ID.',
					'Include your Windows version and any error text from the loader.',
				],
				list: ['<a href="/updates/">Status page</a>', '<a href="/support/">Support</a>', '<a href="/faq/">FAQ</a>'],
			},
		],
	},
	support: {
		title: 'WARDOGS Support | WARDOGS hacks',
		description:
			'Get support for WARDOGS hacks on Discord — loader setup, delivery, menu config, and Valve Anti-Cheat (VAC) status help after you purchase.',
		h1: 'Support',
		intro: 'Need help with WAR DOGS HACKS? Join Discord with your order ID.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'FAQ',
		ctaSecondaryHref: '/faq/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'How to contact us',
				paragraphs: [
					'Open Discord from the Support page. Include your order ID and a short note about the issue.',
					'For VAC status questions after a Steam patch, link the latest Status note when you write in.',
				],
				list: ['Order ID from your receipt', 'Windows version', 'What you already tried'],
			},
		],
	},
	faq: {
		title: 'WARDOGS FAQ | WARDOGS hacks',
		description:
			'FAQ for WARDOGS hacks on Windows PC — $35 monthly and $150 lifetime, aimbot and ESP features, VAC status, setup, and Discord support.',
		h1: 'FAQ',
		intro: 'Short answers about delivery, setup, VAC status, updates, and refunds.',
		ctaPrimary: 'Buy Now',
		ctaSecondary: 'Support',
		ctaSecondaryHref: '/support/',
		galleryTitle: 'In-game look',
		sections: [
			{
				h2: 'Buying & delivery',
				paragraphs: [
					'You get a digital license by email after payment.',
					'Monthly is $35 and lifetime is $150 USD — same features on both plans.',
				],
				list: ['Instant delivery after checkout', 'Keep your order email', 'One license per purchase'],
			},
			{
				h2: 'Setup & updates',
				paragraphs: [
					'Follow Setup after you buy. Check Status after big WARDOGS or VAC patches.',
					'Discord support can help with loader issues and menu configuration.',
				],
				list: ['<a href="/setup/">Setup guide</a>', '<a href="/updates/">Status</a>'],
			},
			{
				h2: 'Refunds',
				paragraphs: [
					'Read the refund policy before you buy if you need details.',
					'Contact Discord support with your order ID for billing questions.',
				],
				list: ['<a href="/refund/">Refund policy</a>', '<a href="/support/">Support</a>'],
			},
		],
	},
};
