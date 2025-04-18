import type { RoleListType, UserInfoType } from "@/api/types";
import type { FormProps } from "antd";

import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { Button, Col, Form, Input, Row, Select, Statistic } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import emailService from "@/api/services/emailService";
import roleService from "@/api/services/roleService";
import userService from "@/api/services/userService";

import { CloseCircleOutlined } from "@ant-design/icons";
import { ReturnButton } from "./components/ReturnButton";
import { LoginStateEnum, useLoginStateContext } from "./providers/LoginStateProvider";

function RegisterForm() {
	const { loginState, backToLogin } = useLoginStateContext();
	const { Countdown } = Statistic;
	const [form] = Form.useForm();
	const { t } = useTranslation();
	const [countdown, setCountdown] = useState(0); // 倒计时的秒数
	const [second, setSecond] = useState(0);
	const [roleList, setRoleList] = useState<RoleListType[]>([]);
	const [loading, setLoading] = useState(false);

	const registerMutation = useMutation({
		mutationFn: userService.register,
	});

	const sendVerifyCodeMutation = useMutation({
		mutationFn: emailService.sendVerifyCode,
		onSuccess(data) {
			if (data) {
				toast.success(data, {
					position: "top-center",
				});
			}
		},
	});

	const validateVerifyCodeMutation = useMutation({
		mutationFn: emailService.validateVerifyCode,
	});

	const { data: roles } = useQuery({
		queryKey: ["roles"],
		queryFn: roleService.getRoleList,
		// staleTime: 5 * 60 * 1000, // 5分钟保鲜期
		// gcTime: 15 * 60 * 1000, // 15分钟缓存保留
		// refetchOnWindowFocus: true, // 窗口聚焦时自动刷新
		enabled: true,
	});

	useEffect(() => {
		if (roles) setRoleList(roles);
	}, [roles]);

	const sendCode = async () => {
		// TODO: 发送验证码请求
		const email = form.getFieldValue("email");
		if (!email) {
			toast.error(t("sys.login.emaildPlaceholder"), { position: "top-center" });
			return;
		}
		setCountdown(60);
		setSecond(60);
		await sendVerifyCodeMutation.mutateAsync({ email });
	};

	const resetCode = () => {
		// 重启倒计时
		setCountdown(0);
		setSecond(60);
	};

	const handleReset = () => form.resetFields();

	const onFinish: FormProps<UserInfoType>["onFinish"] = async (values) => {
		setLoading(true);
		try {
			const verificationCodeState = await validateVerifyCodeMutation.mutateAsync({
				email: form.getFieldValue("email"),
				code: form.getFieldValue("captcha"),
			});
			console.log("verificationCodeState--->", typeof verificationCodeState);
			console.log("Received values of form: ", values);
			const selectedRole = roleList.find((role) => role.id === values.roleId);
			const data = await registerMutation.mutateAsync({
				...values,
				role: (selectedRole as RoleListType)?.role,
				roleName: (selectedRole as RoleListType)?.roleName,
			});
			if (data) {
				toast.success(t("sys.login.registeredSuccess"), {
					position: "top-center",
				});
			}
			backToLogin();
			handleReset();
		} finally {
			setLoading(false);
		}
	};

	return (
		loginState === LoginStateEnum.REGISTER && (
			<>
				<div className="mb-4 text-2xl font-bold xl:text-3xl text-center">{t("sys.login.signUpFormTitle")}</div>
				<Form
					name="register"
					form={form}
					size="large"
					initialValues={{ remember: true }}
					onFinish={onFinish}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
				>
					<Form.Item
						name="username"
						label={t("sys.login.userName")}
						rules={[{ required: true, message: t("sys.login.accountPlaceholder") }]}
					>
						<Input placeholder={t("sys.login.userName")} />
					</Form.Item>
					<Form.Item
						name="password"
						label={t("sys.login.password")}
						rules={[{ required: true, message: t("sys.login.passwordPlaceholder") }]}
					>
						<Input.Password type="password" placeholder={t("sys.login.password")} />
					</Form.Item>
					<Form.Item
						name="confirmPassword"
						label={t("sys.login.confirmPassword")}
						rules={[
							{
								required: true,
								message: t("sys.login.confirmPasswordPlaceholder"),
							},
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("password") === value) {
										return Promise.resolve();
									}
									return Promise.reject(new Error(t("sys.login.diffPwd")));
								},
							}),
						]}
					>
						<Input.Password type="password" placeholder={t("sys.login.confirmPassword")} />
					</Form.Item>
					<Form.Item
						name="email"
						label={t("sys.login.email")}
						rules={[{ required: true, message: t("sys.login.emaildPlaceholder") }]}
					>
						<Input placeholder={t("sys.login.email")} />
					</Form.Item>
					<Form.Item
						name="captcha"
						label={t("sys.login.emailVerificationCode")}
						normalize={(value) => Number(value)} // 值标准化处理
						rules={[
							{
								required: true,
								message: t("sys.login.emailVerificationCodePlaceholder"),
							},
							// ({ getFieldValue }) => ({
							//   validator(_, value) {
							//     if (!value || !getFieldValue("email")) {
							//       return Promise.resolve();
							//     }
							//     return Promise.reject(
							//       new Error(t("sys.login.emaildPlaceholder"))
							//     );
							//   },
							// }),
						]}
					>
						<Row justify="space-between">
							<Col span={14}>
								<Input type="number" placeholder={t("sys.login.emailVerificationCode")} />
							</Col>
							<Col span={9} flex={1}>
								<Button disabled={countdown !== 0} className="w-full !text-sm" onClick={() => sendCode()}>
									{countdown === 0 ? (
										<span>{t("sys.login.sendSmsButton")}</span>
									) : (
										<div className="flex items-center justify-center">
											<Countdown
												className="hidden"
												value={Date.now() + countdown * 1000}
												onChange={(time) => {
													setCountdown(Number(time) / 1000);
													setSecond(Math.floor(Number(time) / 1000));
												}}
												format="ss"
												onFinish={resetCode}
											/>
											<span className="ml-1">{t("sys.login.sendSmsText", { second })}</span>
										</div>
									)}
								</Button>
							</Col>
						</Row>
					</Form.Item>
					<Form.Item
						name="mobile"
						label={t("sys.login.mobile")}
						rules={[{ required: true, message: t("sys.login.mobilePlaceholder") }]}
					>
						<Input placeholder={t("sys.login.mobile")} />
					</Form.Item>
					<Form.Item
						name="avatar"
						label={t("sys.login.avatar")}
						rules={[{ required: true, message: t("sys.login.avatarPlaceholder") }]}
					>
						<Input placeholder={t("sys.login.avatar")} />
					</Form.Item>
					<Form.Item
						name="nickName"
						label={t("sys.login.nickName")}
						rules={[{ required: true, message: t("sys.login.nickNamePlaceholder") }]}
					>
						<Input placeholder={t("sys.login.nickName")} />
					</Form.Item>

					<Form.Item
						name="roleId"
						label={t("sys.login.role")}
						rules={[{ required: true, message: t("sys.login.rolePlaceholder") }]}
					>
						<Select
							placeholder={t("sys.login.rolePlaceholder")}
							showSearch
							allowClear
							options={roleList.map((data) => ({
								label: data.role,
								value: data.id,
							}))}
						/>
					</Form.Item>

					<Row gutter={24} justify="space-between" className="mb-6">
						<Col span={12}>
							<Button
								className="w-full"
								icon={<CloseCircleOutlined />}
								onClick={() => {
									handleReset();
								}}
							>
								{t("sys.login.reset")}
							</Button>
						</Col>
						<Col span={12}>
							<Button type="primary" htmlType="submit" loading={loading} className="w-full">
								{t("sys.login.registerButton")}
							</Button>
						</Col>
					</Row>

					<div className="mb-2 text-xs text-gray text-center">
						<span>{t("sys.login.registerAndAgree")}</span>
						<a href="./" className="text-sm !underline">
							{t("sys.login.termsOfService")}
						</a>
						{" & "}
						<a href="./" className="text-sm !underline">
							{t("sys.login.privacyPolicy")}
						</a>
					</div>

					<ReturnButton onClick={backToLogin} />
				</Form>
			</>
		)
	);
}

export default RegisterForm;
