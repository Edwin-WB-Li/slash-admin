import type { AssignMenusToRoleParamsType, MenuOptions, RoleListType } from "@/api/types";

import http from "../apiClient";

export enum RoleApi {
	GetRoleList = "/role/getRoleList",
	GetRoleMenus = "/role/getRoleMenusById",
	CreateOrEditRole = "/role/createOrEditRole",
	DeletedRole = "/role/deleteRoleRole",
	// CreateRoleMenus = "/menus/createMenus",
	AssignMenusToRole = "/role/assignMenusToRole",
	AppendMenusToRole = "/role/appendMenusToRole",
}

const getRoleList = () => http.get<RoleListType[]>({ url: RoleApi.GetRoleList });
const createOrEditRole = (data: RoleListType) => http.post<RoleListType>({ url: RoleApi.CreateOrEditRole, data });
const getRoleMenusByRoleId = (roleId: number) => http.get<MenuOptions[]>({ url: `${RoleApi.GetRoleMenus}/${roleId}` });
// const createRoleMenus = (data: MenuOptions) => http.post<MenuOptions[]>({ url: RoleApi.CreateRoleMenus, data });
const deletedRole = (data: number[]) => http.post<number[]>({ url: RoleApi.DeletedRole, data });
const assignMenusToRole = (data: AssignMenusToRoleParamsType) =>
	http.post<any>({ url: RoleApi.AssignMenusToRole, data });
const appendMenusToRole = (data: AssignMenusToRoleParamsType) =>
	http.post<any>({ url: RoleApi.AppendMenusToRole, data });

export default {
	createOrEditRole,
	getRoleList,
	getRoleMenusByRoleId,
	deletedRole,
	// createRoleMenus,
	assignMenusToRole,
	appendMenusToRole,
};
