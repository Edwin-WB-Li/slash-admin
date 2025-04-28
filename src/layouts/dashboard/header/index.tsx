import type { CSSProperties } from "react";

import { useQuery } from "@tanstack/react-query";
import { Drawer, Spin } from "antd";
import { useState } from "react";

import weathersService from "@/api/services/weathersService";
import { IconButton, Iconify, SvgIcon } from "@/components/icon";
import LocalePicker from "@/components/locale-picker";
import Logo from "@/components/logo";
import AccountDropdown from "@/layouts/components/account-dropdown";
import BreadCrumb from "@/layouts/components/bread-crumb";
import NoticeButton from "@/layouts/components/notice";
import SearchBar from "@/layouts/components/search-bar";
import SettingButton from "@/layouts/components/setting-button";
import { HEADER_HEIGHT, NAV_COLLAPSED_WIDTH, NAV_WIDTH } from "@/layouts/dashboard/config";
import NavVertical from "@/layouts/dashboard/nav/nav-vertical";
import { useSettings } from "@/store/settingStore";
import { themeVars } from "@/theme/theme.css";
import { cn } from "@/utils";
import { rgbAlpha } from "@/utils/theme";
import { ThemeLayout } from "#/enum";

export default function Header() {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const { themeLayout, breadCrumb } = useSettings();

	const { data, isPending } = useQuery({
		queryKey: ["weathersData"],
		queryFn: async () => {
			const res = await weathersService.getWeathers();
			// 保证返回值不是 undefined
			return res[0] ?? [];
		},
		staleTime: 1000 * 60 * 10, // 10分钟内不重新请求
		refetchOnWindowFocus: false, // 窗口聚焦时不自动请求
	});

	const headerStyle: CSSProperties = {
		borderBottom:
			themeLayout === ThemeLayout.Horizontal
				? `1px dashed ${rgbAlpha(themeVars.colors.palette.gray["500Channel"], 0.2)}`
				: "",
		backgroundColor: rgbAlpha(themeVars.colors.background.defaultChannel, 0.9),
		width: "100%",
	};

	return (
		<>
			<header
				className={cn(themeLayout === ThemeLayout.Horizontal ? "relative" : "sticky top-0 right-0 left-auto")}
				style={headerStyle}
			>
				<div
					className="flex flex-grow items-center justify-between px-4 text-gray backdrop-blur xl:px-6 2xl:px-10"
					style={{
						height: HEADER_HEIGHT,
						transition: "height 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
					}}
				>
					<div className="flex items-baseline">
						{themeLayout !== ThemeLayout.Horizontal ? (
							<IconButton onClick={() => setDrawerOpen(true)} className="h-10 w-10 md:hidden">
								<SvgIcon icon="ic-menu" size="24" />
							</IconButton>
						) : (
							<Logo />
						)}
						<div className="ml-4 hidden md:block">{breadCrumb ? <BreadCrumb /> : null}</div>
					</div>

					<div className="flex">
						<Spin spinning={isPending} className="h-full">
							{data && (
								<div className="flex justify-center items-center gap-4 h-full mr-2">
									<span>{data?.province}</span>
									<span>{data?.city}</span>
									<span>{data?.weather}</span>
									<span>{data?.temperature}°</span>
									<span>{data?.winddirection}风</span>
									<span>{data?.windpower}级</span>
									<span>湿度 {data?.humidity} %</span>
								</div>
							)}
						</Spin>
						<SearchBar />
						<LocalePicker />
						<IconButton onClick={() => window.open("https://github.com/d3george/slash-admin")}>
							<Iconify icon="mdi:github" size={24} />
						</IconButton>
						<NoticeButton />
						<SettingButton />
						<AccountDropdown />
					</div>
				</div>
			</header>
			<Drawer
				placement="left"
				onClose={() => setDrawerOpen(false)}
				open={drawerOpen}
				closeIcon={false}
				width={themeLayout === ThemeLayout.Mini ? NAV_COLLAPSED_WIDTH : NAV_WIDTH}
			>
				<NavVertical closeSideBarDrawer={() => setDrawerOpen(false)} />
			</Drawer>
		</>
	);
}
