import type { LoginParams } from '@/api/types';

import { CloseCircleOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillGithub, AiFillGoogleCircle, AiFillWechat } from 'react-icons/ai';
// import { toast } from "sonner";

import { useNavigate } from 'react-router';
const { VITE_APP_HOMEPAGE: HOMEPAGE } = import.meta.env;
import { useLogin, useMenus } from '@/store/userStore';

import { LoginStateEnum, useLoginStateContext } from './providers/LoginStateProvider';
function LoginForm() {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [form] = Form.useForm();
	const { loginState, setLoginState } = useLoginStateContext();
	const featchLogin = useLogin();
	const featchMenus = useMenus();
	const navigate = useNavigate();

	if (loginState !== LoginStateEnum.LOGIN) return null;

	const handleFinish = async ({ username, password }: LoginParams) => {
		setLoading(true);
		try {
			await featchLogin({ username, password });
			await featchMenus();
			// toast.success(t("sys.login.loginSuccess") || "login success!", {
			//   position: "top-center",
			// });
			console.log('跳转前--->5');
			navigate(HOMEPAGE, { replace: true });
			window.location.reload();
			// return <Navigate to="/login" replace />;
			// // window.location.replace(HOMEPAGE);
			console.log('跳转后--->6');
		} finally {
			setLoading(false);
		}
	};

	const handleReset = () => form.resetFields();

	return (
		<Form
			className="sm:shadow sm:rounded-xl sm:shadow-blue-500 sm:p-5"
			form={form}
			name="login"
			size="large"
			initialValues={{
				remember: true,
			}}
			onFinish={handleFinish}
			autoComplete="off"
		>
			<div className="mb-4 flex flex-col">
				<div className="flex flex-col">
					<div className="flex justify-center items-center font-bold text-3xl">{t('sys.login.loginButton')}</div>
				</div>
			</div>

			<Form.Item name="username" rules={[{ required: true, message: t('sys.login.accountPlaceholder') }]}>
				<Input placeholder={t('sys.login.userName')} prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: t('sys.login.passwordPlaceholder') }]}>
				<Input.Password
					type="password"
					prefix={<LockOutlined />}
					placeholder={t('sys.login.password')}
					autoComplete="password"
				/>
			</Form.Item>
			<Form.Item>
				<Row align="middle">
					<Col span={12}>
						<Form.Item name="remember" valuePropName="checked" noStyle>
							<Checkbox>{t('sys.login.rememberMe')}</Checkbox>
						</Form.Item>
					</Col>
					<Col span={12} className="text-right">
						<Button
							type="link"
							className="!underline"
							onClick={() => setLoginState(LoginStateEnum.RESET_PASSWORD)}
							size="small"
						>
							{t('sys.login.forgetPassword')}
						</Button>
					</Col>
				</Row>
			</Form.Item>
			<Form.Item>
				<Row align="middle" gutter={24}>
					<Col span={24} flex="1">
						<Button
							className="w-full"
							icon={<CloseCircleOutlined />}
							onClick={() => {
								handleReset();
							}}
						>
							{t('sys.login.reset')}
						</Button>
					</Col>
					<Col span={24} flex="1">
						<Button type="primary" htmlType="submit" className="w-full" loading={loading} icon={<UserOutlined />}>
							{t('sys.login.loginButton')}
						</Button>
					</Col>
				</Row>
			</Form.Item>

			<Row align="middle" gutter={8}>
				<Col span={9} flex="1">
					<Button className="w-full !text-sm" onClick={() => setLoginState(LoginStateEnum.MOBILE)}>
						{t('sys.login.mobileSignInFormTitle')}
					</Button>
				</Col>
				<Col span={9} flex="1">
					<Button className="w-full !text-sm" onClick={() => setLoginState(LoginStateEnum.QR_CODE)}>
						{t('sys.login.qrSignInFormTitle')}
					</Button>
				</Col>
				<Col span={6} flex="1" onClick={() => setLoginState(LoginStateEnum.REGISTER)}>
					<Button className="w-full !text-sm">{t('sys.login.signUpFormTitle')}</Button>
				</Col>
			</Row>

			<Divider className="!text-xs">{t('sys.login.otherSignIn')}</Divider>

			<div className="flex cursor-pointer justify-around text-2xl">
				<AiFillGithub />
				<AiFillWechat />
				<AiFillGoogleCircle />
			</div>
		</Form>
	);
}

export default LoginForm;
