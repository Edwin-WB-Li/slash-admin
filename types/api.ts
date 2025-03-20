// export interface Result<T = any> {
// 	status?: number;
// 	message: string;
// 	data: T;
// 	code: number;
// }

// * 请求响应参数(不包含data)
export interface Result {
	code: number;
	message: string;
	status?: boolean;
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
	status?: boolean;
}

export interface UserInfoType {
	id?: string;
	_id: string;
	username: string;
	password?: string;
	create_time: string;
	update_time: string;
	email: string;
	mobile: string;
	role: string;
	role_name: string;
	avatar: string;
	nick_name: string;
	status: boolean;
}

// * 登录
export namespace Login {
	export interface LoginParams {
		username: string;
		password: string;
	}
	export interface LoginResponse {
		token: string;
		userInfo: UserInfoType;
	}
	export interface ResAuthButtons {
		[propName: string]: any;
	}
}

export namespace Weathers {
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
}
