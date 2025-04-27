import type { LoginParams, MenuOptions, UserInfoType } from "@/api/types";

import { useMutation } from "@tanstack/react-query";
// import { useNavigate } from 'react-router';
import { toast } from "sonner";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import roleService from "@/api/services/roleService";
import userService from "@/api/services/userService";
import { t } from "@/locales/i18n";
import { StorageEnum } from "#/enum";
// const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

type UserStore = {
	userInfo: Partial<UserInfoType>;
	userToken: string;
	userMenus: MenuOptions[];
	// 使用 actions 命名空间来存放所有的 action
	actions: {
		setUserInfo: (userInfo: UserInfoType) => void;
		setUserToken: (token: string) => void;
		setUserMenus: (menus: MenuOptions[]) => void;
		clearUserInfoAndToken: () => void;
	};
};

const useUserStore = create<UserStore>()(
	persist(
		(set) => ({
			userInfo: {},
			userToken: "",
			userMenus: [],
			actions: {
				setUserInfo: (userInfo) => set({ userInfo }),
				setUserToken: (userToken) => {
					set({ userToken });
				},
				setUserMenus: (userMenus) => {
					set({ userMenus });
				},
				clearUserInfoAndToken() {
					set({ userInfo: {}, userToken: "", userMenus: [] });
				},
			},
		}),
		{
			name: "userStore", // name of the item in the storage (must be unique)
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
	// const navigatge = useNavigate();
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
			toast.success(t("sys.login.loginSuccess") || "login success!", {
				position: "top-center",
			});
			return res;
			// navigatge(HOMEPAGE, { replace: true });
		} catch (err) {
			throw new Error(err || t("sys.api.apiRequestFailed"));
		}
	};
	return login;
};

/**
 * @description 获取菜单列表
 */
// export const useMenus = () => {
// 	const { setUserMenus } = useUserActions();
// 	// const navigate = useNavigate();

// 	const getMenusMutation = useMutation({
// 		mutationFn: userService.getMenus,
// 	});
// 	const getMenus = async () => {
// 		try {
// 			const data = await getMenusMutation.mutateAsync();
// 			if (data) {
// 				setUserMenus(data);
// 			}
// 			// navigate(HOMEPAGE, { replace: true });
// 		} catch (err) {
// 			throw new Error(err || t("sys.api.apiRequestFailed"));
// 		}
// 	};
// 	return getMenus;
// };

export const useMenus = () => {
	const { setUserMenus } = useUserActions();
	const getMenus = async (roleId: number) => {
		try {
			const data = await roleService.getRoleMenusByRoleId(roleId);
			if (data) {
				setUserMenus(data);
			}
			return data;
			// navigate(HOMEPAGE, { replace: true });
		} catch (err) {
			throw new Error(err || t("sys.api.apiRequestFailed"));
		}
	};
	return getMenus;
};

export default useUserStore;
