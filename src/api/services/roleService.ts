import type { RoleListResonseType } from "@/api/types";

import http from "../apiClient";

export enum RoleApi {
	GetRoleList = "/role/getRoleList",
}

// const login = (data: LoginParams) => http.post<LoginResponse>({ url: UserApi.Login, data });
const getRoleList = () => http.get<RoleListResonseType[]>({ url: RoleApi.GetRoleList });

export default {
	getRoleList,
};
