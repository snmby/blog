<script lang="ts">
import DropdownItem from "@/components/common/DropdownItem.svelte";
import DropdownPanel from "@/components/common/DropdownPanel.svelte";
import Icon from "@/components/common/Icon.svelte";
import type { DesktopWallpaperStyle } from "@/utils/setting-utils";
import {
	getStoredDesktopWallpaperStyle,
	setDesktopWallpaperStyle,
} from "@/utils/setting-utils";
import { onMount } from "svelte";

let style: DesktopWallpaperStyle = $state("animated");

function switchDesktopWallpaperStyle(nextStyle: DesktopWallpaperStyle) {
	style = nextStyle;
	setDesktopWallpaperStyle(nextStyle);
	document
		.getElementById("desktop-wallpaper-style-panel")
		?.classList.add("float-panel-closed");
}

onMount(() => {
	style = getStoredDesktopWallpaperStyle();

	const handleStyleChange = (event: Event) => {
		const customEvent = event as CustomEvent<{ style: DesktopWallpaperStyle }>;
		if (
			customEvent.detail?.style === "animated" ||
			customEvent.detail?.style === "static"
		) {
			style = customEvent.detail.style;
		}
	};

	window.addEventListener(
		"desktopWallpaperStyleChange",
		handleStyleChange,
	);

	return () => {
		window.removeEventListener(
			"desktopWallpaperStyleChange",
			handleStyleChange,
		);
	};
});
</script>

<div class="relative z-50 hidden lg:block">
	<button
		aria-label="Desktop Wallpaper Style"
		aria-haspopup="menu"
		class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
		id="desktop-wallpaper-style-switch"
		title="桌面壁纸"
	>
		<div class="absolute inset-0 flex items-center justify-center" class:opacity-0={style !== "animated"}>
			<Icon icon="material-symbols:motion-photos-auto-outline-rounded" class="text-[1.25rem]"></Icon>
		</div>
		<div class="absolute inset-0 flex items-center justify-center" class:opacity-0={style !== "static"}>
			<Icon icon="material-symbols:image-outline" class="text-[1.25rem]"></Icon>
		</div>
	</button>
	<div
		id="desktop-wallpaper-style-panel"
		class="absolute transition float-panel-closed top-11 -right-2 pt-5 z-50"
		role="menu"
		aria-labelledby="desktop-wallpaper-style-switch"
	>
		<DropdownPanel>
			<DropdownItem
				role="menuitem"
				isActive={style === "animated"}
				isLast={false}
				onclick={() => switchDesktopWallpaperStyle("animated")}
			>
				<Icon icon="material-symbols:motion-photos-auto-outline-rounded" class="text-[1.25rem] mr-3"></Icon>
				动图
			</DropdownItem>
			<DropdownItem
				role="menuitem"
				isActive={style === "static"}
				isLast={true}
				onclick={() => switchDesktopWallpaperStyle("static")}
			>
				<Icon icon="material-symbols:image-outline" class="text-[1.25rem] mr-3"></Icon>
				静图
			</DropdownItem>
		</DropdownPanel>
	</div>
</div>
