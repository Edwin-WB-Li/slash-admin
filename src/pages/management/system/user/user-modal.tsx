import type { RoleListType, UserInfoType } from "@/api/types";

import { Form, Input, Modal, Radio, Select } from "antd";
import { t } from "i18next";
import { useEffect } from "react";
import { toast } from "sonner";

export type UserModalProps = {
	formValue: UserInfoType;
	title: string;
	show: boolean;
	roleListData: RoleListType[];
	onOk: (values: UserInfoType) => void;
	onCancel: VoidFunction;
};

export default function UserModal({ title, show, formValue, roleListData, onOk, onCancel }: UserModalProps) {
	const [form] = Form.useForm();

	useEffect(() => {
		if (formValue) {
			console.log(formValue);
			form.setFieldsValue({ ...formValue });
		}
	}, [formValue, form]);

	const handleSumbit = async () => {
		try {
			// 校验表单字段
			const values = await form.validateFields();
			// 如果校验通过，调用父组件的 onOk 回调
			if (title === "Edit") {
				const mergedValues = { id: formValue.id, ...values };
				onOk(mergedValues);
			} else {
				onOk(values);
			}
		} catch (error) {
			console.log("表单校验失败", error);
			toast.error(t("common.perfectTheForm"), {
				position: "top-center",
			});
		}
	};

	return (
		<Modal title={title} open={show} onOk={handleSumbit} onCancel={onCancel} destroyOnClose forceRender>
			<Form form={form} name="userListModal" labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal">
				<Form.Item<UserInfoType>
					label="UserName"
					name="username"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input placeholder={t("common.inputText")} />
				</Form.Item>

				{title === "Create" && (
					<>
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
					</>
				)}

				<Form.Item<UserInfoType>
					label="NickName"
					name="nickName"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input placeholder={t("common.inputText")} />
				</Form.Item>

				<Form.Item<UserInfoType>
					label="Email"
					name="email"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input placeholder={t("common.inputText")} />
				</Form.Item>

				<Form.Item<UserInfoType>
					label="Mobile"
					name="mobile"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input placeholder={t("common.inputText")} />
				</Form.Item>

				<Form.Item<UserInfoType>
					label="Avatar"
					name="avatar"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input placeholder={t("sys.login.avatarPlaceholder")} />
				</Form.Item>

				<Form.Item<UserInfoType>
					label="Role"
					name="roleId"
					rules={[{ required: true, message: t("common.chooseText") }]}
				>
					<Select
						placeholder={t("sys.login.rolePlaceholder")}
						showSearch
						allowClear
						options={roleListData.map((data) => ({
							label: data.role,
							value: data.id,
						}))}
					/>
				</Form.Item>

				<Form.Item<UserInfoType> label="Status" name="status" required>
					<Radio.Group optionType="button" buttonStyle="solid">
						<Radio value={true}> Enable </Radio>
						<Radio value={false}> Disable </Radio>
					</Radio.Group>
				</Form.Item>

				<Form.Item<UserInfoType> label="Desc" name="desc" rules={[{ required: true, message: t("common.inputText") }]}>
					<Input.TextArea placeholder={t("common.inputText")} />
				</Form.Item>
			</Form>
		</Modal>
	);
}
