import type { LoginParams, LoginResponse, MenuOptions } from '@/api/types';
import type { UserInfo, UserToken } from '#/entity';

import http from '../apiClient';

export interface SignInReq {
	username: string;
	password: string;
}

export interface SignUpReq extends SignInReq {
	email: string;
}
export type SignInRes = UserToken & { user: UserInfo };

export enum UserApi {
	Login = '/user/login',
	SignUp = '/auth/signup',
	Logout = '/auth/logout',
	Refresh = '/auth/refresh',
	User = '/user',
	Menus = '/menus/getMenuList',
}

const login = (data: LoginParams) => http.post<LoginResponse>({ url: UserApi.Login, data });
const signup = (data: SignUpReq) => http.post<SignInRes>({ url: UserApi.SignUp, data });
const getMenus = () => http.get<MenuOptions[]>({ url: UserApi.Menus });
const logout = () => http.get({ url: UserApi.Logout });
const findById = (id: string) => http.get<UserInfo[]>({ url: `${UserApi.User}/${id}` });

export default {
	login,
	signup,
	findById,
	logout,
	getMenus,
};
