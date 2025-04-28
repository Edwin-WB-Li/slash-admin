import type { BasicStatus, PermissionType, StatusEnum } from "#/enum";

// * 请求响应参数(不包含data)
export interface Result {
	code: string;
	message: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data?: T;
}

// 定义一个接口来描述 data 的结构
export interface ResponseData<T> {
	code: number;
	message: string;
	data: T;
}

export interface UserInfoType {
	id?: number;
	username: string;
	password?: string;
	confirmPassword?: string;
	createTime?: string;
	updateTime?: string;
	email: string;
	mobile: string;
	role: string;
	roleId: number | null;
	roleName?: string;
	avatar: string;
	desc: string;
	nickName: string;
	status?: boolean;
	isDeleted?: boolean;
	captcha?: number;
	createdTime?: string | Date;
	updatedTime?: string | Date;
}

// * 登录
export interface LoginParams {
	username: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	userInfo: UserInfoType;
}

export interface UserListParams {
	username: string;
	role: string | null;
	nickName: string;
	status: boolean;
	isDeleted: boolean;
	createdTime: string[];
	page?: number;
	pageSize?: number;
}
export interface UserListResponse {
	list: UserInfoType[];
	total: number;
	page?: number;
	pageSize: number;
}

export interface MenuOptions {
	id?: number;
	parentId: number | null;
	order?: number;
	path: string;
	title?: string;
	component?: string;
	hide?: boolean;
	hideMenu?: boolean;
	hideTab?: boolean;
	status?: BasicStatus;
	frameSrc?: URL;
	newFeature?: boolean;
	disabled: boolean;
	type: PermissionType;
	name: string;
	label: string;
	icon?: string;
	createdTime?: string | Date;
	updatedTime?: string | Date;
	children?: MenuOptions[];
}

export interface RoleListType {
	id?: number;
	role: string;
	roleName: string;
	desc: string;
	status: StatusEnum;
	permissions?: number[];
	createdTime?: Date;
	createdBy?: string | null;
	updatedBy?: string | null;
	updatedTime?: Date;
}

export interface AssignMenusToRoleParamsType {
	roleId: number;
	menuIds: number[];
}

export interface WeathersResponseType {
	province: string;
	city: string;
	adcode: string;
	weather: string;
	temperature: string;
	winddirection: string;
	windpower: string;
	humidity: string;
	reporttime: string;
	temperature_float: string;
	humidity_float: string;
}
