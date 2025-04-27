import type { MenuOptions } from "@/api/types";

import http from "../apiClient";

export enum MenuApi {
	geMenuInfoById = "/role/getRoleMenusById",
	CreateMenus = "/menus/createMenus",
	EditMenus = "/menus/editMenus",
	GetAllMenus = "/menus/getMenuList",
	DeleteMenus = "/menus/deleteMenus",
}

const geMenuInfoById = (menuId: number) => http.get<MenuOptions[]>({ url: `${MenuApi.geMenuInfoById}/${menuId}` });
const getAllMenus = () => http.get<MenuOptions[]>({ url: `${MenuApi.GetAllMenus}` });
const createMenus = (data: MenuOptions) => http.post<MenuOptions[]>({ url: MenuApi.CreateMenus, data });
const editMenus = (data: MenuOptions) => http.post<MenuOptions>({ url: MenuApi.EditMenus, data });
const deleteMenus = (data: number[]) => http.post<number[]>({ url: MenuApi.DeleteMenus, data });

export default {
	geMenuInfoById,
	createMenus,
	editMenus,
	deleteMenus,
	getAllMenus,
};
