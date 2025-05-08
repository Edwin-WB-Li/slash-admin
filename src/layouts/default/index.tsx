import type { TourProps } from "antd";
import type { CSSProperties } from "react";

import { Layout, Tour } from "antd";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";

import { CircleLoading } from "@/components/loading";
import { down, useMediaQuery } from "@/hooks";
import { useSettingActions, useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { ThemeLayout } from "#/enum";
import { NAV_COLLAPSED_WIDTH, NAV_WIDTH } from "./config";
import Header from "./header";
import Main from "./main";
import Nav from "./nav";

function DefaultLayout() {
	const settings = useSettings();
	const { themeLayout, guide } = useSettings();
	const { setSettings } = useSettingActions();
	const mobileOrTablet = useMediaQuery(down("md"));

	const layoutClassName = useMemo(() => {
		return cn("flex h-screen overflow-hidden", themeLayout === ThemeLayout.Horizontal ? "flex-col" : "flex-row");
	}, [themeLayout]);

	const headerRef = useRef(null);
	const navRef = useRef(null);
	const mainRef = useRef(null);
	const [openTour, setOpenTour] = useState<boolean>(false);
	const [currentStep, setCurrentStep] = useState(0);

	const getPaddingLeft = () => {
		if (mobileOrTablet) return 0;
		switch (themeLayout) {
			case ThemeLayout.Horizontal:
				return 0;
			case ThemeLayout.Mini:
				return NAV_COLLAPSED_WIDTH;
			default:
				return NAV_WIDTH;
		}
	};

	const secondLayoutStyle: CSSProperties = {
		display: "flex",
		flexDirection: "column",
		transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
		paddingLeft: getPaddingLeft(),
	};

	const steps: TourProps["steps"] = [
		{
			title: "Header Content",
			description: "This is the header content area.",
			target: () => headerRef.current,
		},
		{
			title: "Sider Content",
			description: "This is the sider content area.",
			placement: themeLayout === ThemeLayout.Horizontal ? "bottom" : "right",
			target: () => navRef.current,
		},
		{
			title: "Main Content",
			description: "This is the main content area.",
			target: () => mainRef.current,
		},
	];

	useEffect(() => {
		if (!guide) {
			setOpenTour(true);
		}
	}, [guide]);

	// 关闭漫游引导
	const handleTourChange = () => {
		setOpenTour(false);
		setSettings({
			...settings,
			guide: true,
		});
	};

	return (
		<Layout className={layoutClassName}>
			<Tour open={openTour} current={currentStep} onClose={handleTourChange} onChange={setCurrentStep} steps={steps} />
			<Suspense fallback={<CircleLoading />}>
				<Layout style={secondLayoutStyle}>
					<Header ref={headerRef} />
					<Nav ref={navRef} />
					<Main ref={mainRef} />
				</Layout>
			</Suspense>
		</Layout>
	);
}
export default DefaultLayout;
