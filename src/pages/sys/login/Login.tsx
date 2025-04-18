import { Layout } from "antd";
// import { Layout, Typography } from "antd";
// import { useTranslation } from "react-i18next";
import { Navigate } from "react-router";

// import DashboardImg from "@/assets/images/background/dashboard.png";
// import Overlay from "@/assets/images/background/overlay.jpg";
import BackguoundImage from "@/assets/images/background/login_bg.svg";
import LocalePicker from "@/components/locale-picker";
import { useUserToken } from "@/store/userStore";

import SettingButton from "@/layouts/components/setting-button";
import { themeVars } from "@/theme/theme.css";
import { rgbAlpha } from "@/utils/theme";
import LoginForm from "./LoginForm";
import MobileForm from "./MobileForm";
import QrCodeFrom from "./QrCodeForm";
import RegisterForm from "./RegisterForm";
import ResetForm from "./ResetForm";
import { LoginStateProvider } from "./providers/LoginStateProvider";

const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;

function Login() {
	// const { t } = useTranslation();
	const token = useUserToken();
	// console.log("login token", token);

	// // 判断用户是否有权限
	// // if (token.accessToken) {
	if (token) {
		// 如果有授权，则跳转到首页
		return <Navigate to={HOMEPAGE} replace />;
	}

	const gradientBg = rgbAlpha(themeVars.colors.background.defaultChannel, 0.8);
	const bg = `linear-gradient(${gradientBg}, ${gradientBg}) center center / cover no-repeat,url(${BackguoundImage})`;

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
				<SettingButton />
			</div>
		</Layout>
	);
}

export default Login;
