import type { GetProp, MenuProps } from "antd";
import type { AppRouteObject } from "#/router";

import * as Icons from "@ant-design/icons";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Iconify, SvgIcon } from "@/components/icon";

import { useSettings } from "@/store/settingStore";
import { cn } from "@/utils";
import { ThemeLayout } from "#/enum";

type MenuItem = GetProp<MenuProps, "items">[number];

const renderIcon = (icon: string | React.ReactNode): React.ReactNode => {
	if (typeof icon !== "string") return icon;

	// 判断是否为 iconify 格式
	if (icon.includes(":")) {
		return <Iconify icon={icon} size={24} className="ant-menu-item-icon" />;
	}

	// Ant Design 图标（如 "CaretLeftOutlined"）
	if (icon in Icons) {
		const AntdIcon = (Icons as any)[icon];
		return <AntdIcon className="ant-menu-item-icon" />;
	}

	// 自定义 svg
	if (icon.includes("ic")) {
		return <SvgIcon icon={icon} size={24} className="ant-menu-item-icon" />;
	}
	return null;
};

/**
 *   routes -> menus
 */
export function useRouteToMenuFn() {
	const { t } = useTranslation();
	const { themeLayout } = useSettings();

	const routeToMenuFn = useCallback(
		(items: AppRouteObject[]): MenuItem[] => {
			return items
				.filter((item) => !item.meta?.hideMenu)
				.map((item) => {
					const { meta, children } = item;
					if (!meta) return {} as MenuItem;

					const menuItem: Partial<MenuItem> = {
						key: meta.key,
						disabled: meta.disabled,
						label: (
							<div
								className={cn(
									"inline-flex items-center overflow-hidden",
									themeLayout === ThemeLayout.Horizontal ? "justify-start" : "justify-between",
								)}
							>
								<div className="">{t(meta.label)}</div>
								{meta.suffix}
							</div>
						),
						...(meta.icon && { icon: renderIcon(meta.icon) }),
						...(children && { children: routeToMenuFn(children) }),
					};

					return menuItem as MenuItem;
				});
		},
		[t, themeLayout],
	);

	return routeToMenuFn;
}
