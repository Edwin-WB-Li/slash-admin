import type { MenuOptions, RoleListType } from "@/api/types";

import http from "../apiClient";

export enum RoleApi {
	GetRoleList = "/role/getRoleList",
	GetRoleMenus = "/role/getRoleMenusById",
	CreateOrEditRole = "/role/createOrEditRole",
	CreateRoleMenus = "/menus/addMenus",
}

const getRoleList = () => http.get<RoleListType[]>({ url: RoleApi.GetRoleList });
const createOrEditRole = (data: RoleListType) => http.post<RoleListType[]>({ url: RoleApi.CreateOrEditRole, data });
const getRoleMenus = (roleId: number) => http.get<MenuOptions[]>({ url: `${RoleApi.GetRoleMenus}/${roleId}` });
const createRoleMenus = (data: MenuOptions) => http.post<MenuOptions[]>({ url: RoleApi.CreateRoleMenus, data });

export default {
	createOrEditRole,
	getRoleList,
	getRoleMenus,
	createRoleMenus,
};
