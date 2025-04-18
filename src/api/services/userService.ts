import type {
	LoginParams,
	LoginResponse,
	MenuOptions,
	UserInfoType,
	UserListParams,
	UserListResponse,
} from "@/api/types";
import type { UserInfo, UserToken } from "#/entity";

import http from "../apiClient";

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	Login = "/user/login",
	Register = "/user/createOrEditUser",
	Logout = "/auth/logout",
	Refresh = "/auth/refresh",
	User = "/user",
	UserList = "/user/getUserList",
	Menus = "/menus/getMenuList",
}

const login = (data: LoginParams) => http.post<LoginResponse>({ url: UserApi.Login, data });
const register = (data: UserInfoType) => http.post<UserInfoType>({ url: UserApi.Register, data });
const getUserList = (data: UserListParams) => http.post<UserListResponse>({ url: UserApi.UserList, data });
// const sendVerifyCode = (data: { email: string }) => http.post<string>({ url: UserApi.SendVerifyCode, data });
const getMenus = () => http.get<MenuOptions[]>({ url: UserApi.Menus });
const logout = () => http.get({ url: UserApi.Logout });
const findById = (id: string) => http.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	login,
	register,
	findById,
	logout,
	getMenus,
	getUserList,
};
