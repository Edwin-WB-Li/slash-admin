import type { LoginParams, MenuOptions, UserInfoType } from '@/api/types';

import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import userService from '@/api/services/userService';
import { t } from '@/locales/i18n';
import { toast } from 'sonner';
import { StorageEnum } from '#/enum';
const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
	userInfo: Partial<UserInfoType>;
	userToken: string;
	userMenus: MenuOptions[];
	// 使用 actions 命名空间来存放所有的 action
	actions: {
		setUserInfo: (userInfo: UserInfoType) => void;
		setUserToken: (token: string) => void;
		setMenus: (menus: MenuOptions[]) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: '',
			userMenus: [],
			actions: {
				setUserInfo: (userInfo) => {
					set({ userInfo });
				},
				setUserToken: (userToken) => {
					set({ userToken });
				},
				setMenus: (userMenus) => {
					set({ userMenus });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: '', userMenus: [] });
				},
			},
		}),
		{
			name: 'userStore', // name of the item in the storage (must be unique)
			storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
			partialize: (state) => ({
				[StorageEnum.UserInfo]: state.userInfo,
				[StorageEnum.UserToken]: state.userToken,
				[StorageEnum.UserMenus]: state.userMenus,
			}),
		},
	),
);

export const useUserInfo = () => useUserStore((state) => state.userInfo);
export const useUserToken = () => useUserStore((state) => state.userToken);
export const useUserPermission = () => useUserStore((state) => state.userMenus);
export const useUserActions = () => useUserStore((state) => state.actions);

/**
 * @description 登录
 */
export const useLogin = () => {
	const navigatge = useNavigate();
	const { setUserToken, setUserInfo } = useUserActions();
	const loginMutation = useMutation({
		mutationFn: userService.login,
	});
	const login = async (data: LoginParams) => {
		try {
			const res = await loginMutation.mutateAsync(data);
			const { token, userInfo } = res;
			setUserToken(token);
			setUserInfo(userInfo);
			toast.success(t('sys.login.loginSuccess') || 'login success!', {
				position: 'top-center',
			});
			navigatge(HOMEPAGE, { replace: true });
		} catch (err) {
			throw new Error(err || t('sys.api.apiRequestFailed'));
		}
	};
	return login;
};

/**
 * @description 获取菜单列表
 */
export const useMenus = () => {
	const { setMenus } = useUserActions();
	const getMenusMutation = useMutation({
		mutationFn: userService.getMenus,
	});
	const getMenus = async () => {
		try {
			const res = await getMenusMutation.mutateAsync();
			if (res) {
				setMenus(res);
			}
		} catch (err) {
			throw new Error(err || t('sys.api.apiRequestFailed'));
		}
	};
	return getMenus;
};

export default useUserStore;
