import type { MenuOptions } from "@/api/types";

import http from "../apiClient";

export enum MenuApi {
	geMenuInfoById = "/role/getRoleMenusById",
	CreateMenus = "/menus/addMenus",
	EditMenus = "/menus/editMenus",
}

const geMenuInfoById = (menuId: number) => http.get<MenuOptions[]>({ url: `${MenuApi.geMenuInfoById}/${menuId}` });
const editMenus = (data: MenuOptions) => http.post<MenuOptions>({ url: MenuApi.EditMenus, data });
const createMenus = (data: MenuOptions) => http.post<MenuOptions[]>({ url: MenuApi.CreateMenus, data });

export default {
	geMenuInfoById,
	createMenus,
	editMenus,
};
