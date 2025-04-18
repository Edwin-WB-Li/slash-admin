import type { MenuOptions } from "@/api/types";
import type { AppRouteObject, RouteMeta } from "#/router";

import { ascend } from "ramda";

/**
 * @description 过滤和排序菜单路由：1. 递归过滤掉没有meta.key的路由项；2. 对子路由递归处理；3. 按order字段升序排列，无order项默认排最后
 */
export const menuFilter = (items: AppRouteObject[]) => {
	return (
		items
			.filter((item) => {
				const show = item.meta?.key;
				if (show && item.children) {
					// 如果当前路由有子路由（item.children），对子路由递归调用 menuFilter
					item.children = menuFilter(item.children);
				}
				return show;
			})
			// 使用 ramda 的 ascend 方法，根据 order 字段升序排列。
			// 如果 order 不存在，使用 Number.POSITIVE_INFINITY，将其排在最后。
			.sort(ascend((item) => item.order || Number.POSITIVE_INFINITY))
	);
};

/**
 * @description 排序菜单路由：对子路由递归处理；按order字段升序排列，无order项默认排最后
 */
export const menusOrderFilter = (items: MenuOptions[]) => {
	return (
		items
			.map((item) => {
				if (item.children && item.children.length > 0) {
					// 如果当前路由有子路由（item.children），对子路由递归调用 menuFilter
					item.children = menusOrderFilter(item.children);
				}
				return item; // Ensure the item is returned
			})
			// 使用 ramda 的 ascend 方法，根据 order 字段升序排列。
			// 如果 order 不存在，使用 Number.POSITIVE_INFINITY，将其排在最后。
			.sort(ascend((item) => item.order || Number.POSITIVE_INFINITY))
	);
};

/**
 * @description 基于 src/router/routes/modules 文件结构动态生成路由
 */
export function getRoutesFromModules() {
	const menuModules: AppRouteObject[] = [];

	const modules = import.meta.glob("./routes/modules/**/*.tsx", {
		eager: true,
	});
	for (const key in modules) {
		const mod = (modules as any)[key].default || {};
		const modList = Array.isArray(mod) ? [...mod] : [mod];
		menuModules.push(...modList);
	}
	return menuModules;
}

/**
 * @description return the routes will be used in sidebar menu
 */
export function getMenuRoutes(appRouteObjects: AppRouteObject[]) {
	// return menuFilter(getMenuModules());
	return menuFilter(appRouteObjects);
}

/**
 * return flatten routes
 */
export function flattenMenuRoutes(routes: AppRouteObject[]) {
	return routes.reduce<RouteMeta[]>((prev, item) => {
		const { meta, children } = item;
		if (meta) prev.push(meta);
		if (children) prev.push(...flattenMenuRoutes(children));
		return prev;
	}, []);
}

// 在组件顶部定义角色颜色映射
export const roleColorMap: Record<string, string> = {
	admin: "red",
	shop: "blue",
	guest: "green",
	editor: "purple",
	// 添加更多角色映射...
};
