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

// * 分页响应参数
export interface ResPage<T> {
	datalist: T[];
	pageNum: number;
	pageSize: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	pageNum: number;
	pageSize: number;
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
	roleId: number;
	roleName?: string;
	avatar: string;
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

export interface ResAuthButtons {
	[propName: string]: any;
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
	route?: string;
	icon?: string;
	createTime?: string | Date;
	updateTime?: string | Date;
	children?: MenuOptions[];
}

export interface RoleListType {
	id?: number;
	role: string;
	roleName: string;
	desc: string;
	status: StatusEnum;
	createdTime?: Date;
	updatedTime?: Date;
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
