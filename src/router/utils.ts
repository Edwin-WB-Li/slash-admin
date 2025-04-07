import type { AppRouteObject, RouteMeta } from "#/router";

import { ascend } from "ramda";

/**
 * @description 过滤和排序菜单路由：1. 递归过滤掉没有meta.key的路由项；2. 对子路由递归处理；3. 按order字段升序排列，无order项默认排最后
 */
export const menuFilter = (items: AppRouteObject[]) => {
	return items
		.filter((item) => {
			const show = item.meta?.key;
			if (show && item.children) {
				item.children = menuFilter(item.children);
			}
			return show;
		})
		.sort(ascend((item) => item.order || Number.POSITIVE_INFINITY));
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
