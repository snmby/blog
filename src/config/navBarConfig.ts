import {
	type NavBarConfig,
	type NavBarLink,
	type NavBarSearchConfig,
	NavBarSearchMethod,
} from "../types/navBarConfig";
import { siteConfig } from "./siteConfig";

const isEnabled = siteConfig.pages;

/*
 * ============================================================================
 * 个人链接（显示在"联系"子菜单中）
 * 把你自己的社交/平台链接填在这里就行
 * ============================================================================
 */
const personalLinks: NavBarLink[] = [
	{
		name: "🐙 GitHub",
		url: "https://github.com/snmby",   // ← 改成你的 GitHub 主页
		external: true,
	},
	{
		name: "📡 RSS 订阅",
		url: "/rss.xml",
	},
	{
		name: "📧 Email",
		url: "mailto:ligang11266@163.com",    // ← 改成你的邮箱
	},
];

/*
 * ============================================================================
 * 主导航结构
 * 每个菜单项都可以自由增删、调序
 * ============================================================================
 */
const getDynamicNavBarConfig = (): NavBarConfig => {
	const links: NavBarLink[] = [LinkPresets.Home];

	// ── 写作 ──────────────────────────────────────────────
	links.push({
		name: "✍️ 写作",
		url: "#",
		children: [
			LinkPresets.Archive,
			LinkPresets.Categories,
			LinkPresets.Tags,
		],
	});

	// ── 相册（需在 siteConfig.pages 开启） ──────────────────
	if (isEnabled.gallery) {
		links.push(LinkPresets.Gallery);
	}

	// ── 生活（留言 / 友链 / 追番） ────────────────────────
	const notesChildren: NavBarLink[] = [];

	if (isEnabled.guestbook) {
		notesChildren.push(LinkPresets.Guestbook);
	}

	if (isEnabled.friends) {
		notesChildren.push(LinkPresets.Friends);
	}

	if (isEnabled.bangumi) {
		notesChildren.push(LinkPresets.Bangumi);
	}

	if (notesChildren.length > 0) {
		links.push({
			name: "🌿 生活",
			url: "#",
			children: notesChildren,
		});
	}

	// ── 关于 ──────────────────────────────────────────────
	const aboutChildren: NavBarLink[] = [LinkPresets.About];

	if (isEnabled.sponsor) {
		aboutChildren.push(LinkPresets.Sponsor);
	}

	links.push({
		name: "🙋 关于",
		url: "#",
		children: aboutChildren,
	});

	// ── 联系（始终显示） ──────────────────────────────────
	links.push({
		name: "📬 联系",
		url: "#",
		children: personalLinks,
	});

	return { links };
};

export const navBarSearchConfig: NavBarSearchConfig = {
	method: NavBarSearchMethod.PageFind,
};

/*
 * ============================================================================
 * 链接预设 — 名称用 emoji 装饰，icon 留空避免显示黑色 Material 图标
 * ============================================================================
 */
export const LinkPresets: Record<string, NavBarLink> = {
	Home: {
		name: "🏠 首页",
		url: "/",
	},
	Archive: {
		name: "📦 归档",
		url: "/archive/",
	},
	Categories: {
		name: "📂 分类",
		url: "/categories/",
	},
	Tags: {
		name: "🏷️ 标签",
		url: "/tags/",
	},
	Friends: {
		name: "👥 朋友们",
		url: "/friends/",
	},
	Sponsor: {
		name: "☕ 请我喝杯咖啡",
		url: "/sponsor/",
	},
	Guestbook: {
		name: "💬 留言板",
		url: "/guestbook/",
	},
	About: {
		name: "🙋 关于我",
		url: "/about/",
	},
	Bangumi: {
		name: "📺 追番清单",
		url: "/bangumi/",
	},
	Gallery: {
		name: "🖼️ 相册",
		url: "/gallery/",
	},
};

export const navBarConfig: NavBarConfig = getDynamicNavBarConfig();
