import type { ResultData } from '#/api';

import axios, { type AxiosRequestConfig, type AxiosError, type AxiosResponse } from 'axios';

import { t } from '@/locales/i18n';
import userStore from '@/store/userStore';

// import { useRouter } from '@/router/hooks';
// import { ResultEnum } from '#/enum';
import { toast } from 'sonner';
// const router = useRouter();
const { MODE, VITE_API_PROD_BASE_URL, VITE_API_VERSIONS, VITE_PORT, VITE_API_DEV_BASE_URL } = import.meta
	.env as ImportMetaEnv;
const isProd = MODE === 'production';
const baseURL = isProd
	? `${VITE_API_PROD_BASE_URL}${VITE_API_VERSIONS}`
	: `${VITE_API_DEV_BASE_URL}:${VITE_PORT}${VITE_API_VERSIONS}`;

// 创建 axios 实例
const axiosInstance = axios.create({
	baseURL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json;charset=utf-8' },
});

// 请求拦截,在请求被发送之前做些什么
axiosInstance.interceptors.request.use(
	(config) => {
		const token = userStore.getState().userToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		// 请求错误时做些什么
		console.log('请求拦截器 erro:', error);
		return Promise.reject(error);
	},
);

// 响应拦截
axiosInstance.interceptors.response.use(
	(res: AxiosResponse) => {
		const { code, data, message } = res.data;
		// 错误处理
		if (code !== 200) {
			toast.error(message || t('sys.api.apiRequestFailed'), {
				position: 'top-center',
			});
			// token 无效 或者 过期
			if (code === 401) {
				userStore.getState().actions.clearUserInfoAndToken();
				// window.location.reload();
				window.location.href = '/#/login';
			}
			throw new Error(message || t('sys.api.apiRequestFailed'));
		}
		return data;
	},
	(error: AxiosError) => {
		console.log('响应拦截器 error:', error);

		const { response } = error || {};
		// const data = response?.data as ResultData;
		// const errMsg = data?.message || t('sys.api.errorMessage');

		const errMsg = (response?.data as ResultData)?.message || t('sys.api.errorMessage');

		toast.error(errMsg, {
			position: 'top-center',
		});
		// HTTP 401
		if (response?.status === 401) {
			userStore.getState().actions.clearUserInfoAndToken();
			// window.location.reload();
			window.location.href = '/#/login';
		}
		return Promise.reject(errMsg);
	},
);

class APIClient {
	request<T>(config: AxiosRequestConfig): Promise<T> {
		return new Promise((resolve, reject) => {
			axiosInstance
				.request<any, AxiosResponse<T>>(config)
				.then((res: AxiosResponse<T>) => {
					resolve(res as unknown as Promise<T>);
				})
				.catch((e: Error | AxiosError) => {
					reject(e);
				});
		});
	}
	get<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: 'GET' });
	}

	post<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: 'POST' });
	}

	put<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: 'PUT' });
	}

	delete<T>(config: AxiosRequestConfig): Promise<T> {
		return this.request({ ...config, method: 'DELETE' });
	}
}
export default new APIClient();
