import { up } from "@/hooks";
import { useMediaQuery } from "@/hooks";
import { useSettings } from "@/store/settingStore";
import { forwardRef } from "react";
import { ThemeLayout } from "#/enum";
import NavHorizontal from "./nav-horizontal";
import NavVertical from "./nav-vertical";

export default forwardRef<HTMLDivElement>(function Nav(_props, ref) {
	const { themeLayout } = useSettings();
	const isPc = useMediaQuery(up("md"));

	if (themeLayout === ThemeLayout.Horizontal) return <NavHorizontal ref={ref} />;

	if (isPc) return <NavVertical ref={ref} />;
	return null;
});
