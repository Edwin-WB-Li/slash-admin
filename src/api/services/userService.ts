import type { LoginParams, LoginResponse, UserInfoType, UserListParams, UserListResponse } from "@/api/types";

import http from "../apiClient";

export enum UserApi {
	Login = "/user/login",
	Register = "/user/createOrEditUser",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
	UserList = "/user/getUserList",
	CreateOrEdit = "/user/createOrEditUser",
}

const login = (data: LoginParams) => http.post<LoginResponse>({ url: UserApi.Login, data });
const register = (data: UserInfoType) => http.post<UserInfoType>({ url: UserApi.Register, data });
const createOrEdit = (data: UserInfoType) => http.post<UserInfoType>({ url: UserApi.CreateOrEdit, data });
const getUserList = (data: UserListParams) => http.post<UserListResponse>({ url: UserApi.UserList, data });

const logout = () => http.get({ url: UserApi.Logout });

export default {
	login,
	logout,
	register,
	getUserList,
	createOrEdit,
};
