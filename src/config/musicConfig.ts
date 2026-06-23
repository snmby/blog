import type { MusicPlayerConfig } from "../types/musicConfig";

// 音乐播放器配置
export const musicPlayerConfig: MusicPlayerConfig = {
	// 禁用音乐播放器方法：
	// 模板默认侧边栏和导航栏两个都显示
	// 1. 侧边栏：在sidebarConfig.ts侧边栏配置把音乐组件enable设为false禁用即可
	// 2. 导航栏：在本配置文件把showInNavbar设为false禁用即可

	// 是否在导航栏显示音乐播放器入口
	showInNavbar: true,

	// 使用方式：
	// "meting" 优先使用本地音乐列表，再后台追加 Meting API 歌单
	// "local" 只使用本地音乐列表
	mode: "meting",

	// 默认音量 (0-1)
	volume: 0.7,

	// 播放模式：'list'=列表循环, 'one'=单曲循环, 'random'=随机播放
	playMode: "list",

	// 是否显启用歌词
	showLyrics: true,

	// Meting API 配置
	meting: {
		// Meting API 地址
		// 默认使用官方 API，也可以使用自定义 API
		api: "https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r",
		// 音乐平台：netease=网易云音乐, tencent=QQ音乐, kugou=酷狗音乐, xiami=虾米音乐, baidu=百度音乐
		server: "netease",
		// 类型：song=单曲, playlist=歌单, album=专辑, search=搜索, artist=艺术家
		type: "playlist",
		// 歌单/专辑/单曲 ID 或搜索关键词
		id: "18064436343",
		// 认证 token（可选）
		auth: "",
		// 备用 API 配置（当主 API 失败时使用）
		fallbackApis: [
			"https://api.injahow.cn/meting/?server=:server&type=:type&id=:id",
			"https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id",
		],
	},

	// 本地音乐配置
	// E:\CloudMusic\VipSongsDownload 里当前是 .ncm 文件，浏览器不能直接播放。
	// 转为 mp3/flac/m4a/ogg 并放到 public/assets/music 后，再在这里添加条目即可。
	// 1. 支持传入歌词文件的路径
	// lrc: "/assets/music/lrc/使一颗心免于哀伤-哼唱.lrc",
	// 2. 或者直接填入歌词字符串内容
	// lrc: "[00:00.00]歌词内容...",
	local: {
		playlist: [
			{
				name: "难过233秒",
				artist: "ChiliChill乐团",
				url: "/assets/music/ChiliChill乐团 - 难过233秒.mp3",
				cover: "/assets/music/cover/1.jpg",
				lrc: "",
			},
			{
				name: "起风了",
				artist: "买辣椒也用券",
				url: "/assets/music/买辣椒也用券 - 起风了 [mqms2].mp3",
				cover: "/assets/music/cover/2.jpg",
				lrc: "",
			},
			{
				name: "きみと恋のままで終われない いつも夢のままじゃいられない",
				artist: "倉木麻衣",
				url: "/assets/music/倉木麻衣 - きみと恋のままで終われない いつも夢のままじゃいられない.mp3",
				cover: "/assets/music/cover/3.jpg",
				lrc: "",
			},
			{
				name: "渡月橋 ～君 想ふ～",
				artist: "倉木麻衣",
				url: "/assets/music/倉木麻衣 - 渡月橋 ～君 想ふ～.mp3",
				cover: "/assets/music/cover/4.jpg",
				lrc: "",
			},
			{
				name: "霜雪千年",
				artist: "双笙（陈元汐）, 封茗囧菌",
				url: "/assets/music/双笙（陈元汐）, 封茗囧菌 - 霜雪千年.mp3",
				cover: "/assets/music/cover/5.jpg",
				lrc: "",
			},
			{
				name: "我怀念的",
				artist: "孙燕姿",
				url: "/assets/music/孙燕姿 - 我怀念的.mp3",
				cover: "/assets/music/cover/6.jpg",
				lrc: "",
			},
			{
				name: "处处吻",
				artist: "杨千嬅",
				url: "/assets/music/杨千嬅 - 处处吻.mp3",
				cover: "/assets/music/cover/7.jpg",
				lrc: "",
			},
		],
	},
};
