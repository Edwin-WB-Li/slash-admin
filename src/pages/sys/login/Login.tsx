import { Layout } from "antd";
import { Navigate } from "react-router";

import BackgroundImage from "@/assets/icons/ic-login_bg.svg";
import LocalePicker from "@/components/locale-picker";
import { useUserToken } from "@/store/userStore";

import GlobalSettings from "@/components/global-settings";
import { useUserPermission } from "@/store/userStore";
import { themeVars } from "@/theme/theme.css";
import { rgbAlpha } from "@/utils/theme";
import LoginForm from "./LoginForm";
import MobileForm from "./MobileForm";
import QrCodeFrom from "./QrCodeForm";
import RegisterForm from "./RegisterForm";
import ResetForm from "./ResetForm";
import { LoginStateProvider } from "./providers/LoginStateProvider";
const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

export default function Login() {
	const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.8);
	const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${BackgroundImage})`;
	const token = useUserToken();
	const permissionRoutes = useUserPermission();

	// 判断用户是否有权限
	if (token && permissionRoutes?.length > 0) {
		// 如果有授权，则跳转到首页
		return <Navigate to={HOMEPAGE} replace />;
	}

	return (
		<Layout
			className="relative flex !min-h-screen !w-full !flex-row"
			style={{
				background: bg,
			}}
		>
			<div className="m-auto flex w-full max-w-[480px] flex-col justify-center px-[16px] lg:px-[14px]">
				<LoginStateProvider>
					<LoginForm />
					<MobileForm />
					<QrCodeFrom />
					<RegisterForm />
					<ResetForm />
				</LoginStateProvider>
			</div>
			<div className="absolute right-2 top-0 flex flex-row">
				<LocalePicker />
				<GlobalSettings />
			</div>
		</Layout>
	);
}
