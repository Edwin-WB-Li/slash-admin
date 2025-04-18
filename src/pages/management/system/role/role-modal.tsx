import type { RoleListType } from "@/api/types";
// import type { Permission, Role } from "#/entity";

// import { Form, Input, Modal, Radio, Select, Tree } from "antd";
import { Form, Input, Modal, Radio } from "antd";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { toast } from "sonner";

// import { PERMISSION_LIST } from "@/_mock/assets";
// import { flattenTrees } from "@/utils/tree";

import { getEnumOptions } from "@/utils";
import { StatusEnum } from "#/enum";

export type RoleModalProps = {
	formValue: RoleListType;
	title: string;
	show: boolean;
	onOk: (values: RoleListType) => void;
	onCancel: VoidFunction;
};

export interface RoleModalRef {
	resetFields: () => void;
}

// const PERMISSIONS: Permission[] = PERMISSION_LIST as Permission[];
// export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
export const RoleModal = forwardRef<RoleModalRef, RoleModalProps>(function RoleModal(
	{ title, show, formValue, onOk, onCancel },
	ref,
) {
	const [form] = Form.useForm();

	useImperativeHandle(ref, () => ({
		resetFields: () => form.resetFields(),
	}));

	// const flattenedPermissions = flattenTrees(formValue.permission);
	// const checkedKeys = flattenedPermissions.map((item) => item.id);

	useEffect(() => {
		form.setFieldsValue({ ...formValue });
	}, [formValue, form]);

	const handleSumbit = async () => {
		try {
			// 校验表单字段
			const values = await form.validateFields();
			// 如果校验通过，调用父组件的 onOk 回调
			if (title === "Edit") {
				const mergedValues = { id: formValue.id, ...values };
				onOk(mergedValues);
				return;
			}
			onOk(values);
		} catch (error) {
			console.log("表单校验失败", error);
			toast.error(t("common.perfectTheForm"), {
				position: "top-center",
			});
		}
	};

	// useEffect(() => {
	// 	console.log("子组件-formValue", formValue);
	// }, [formValue]);

	return (
		<Modal title={title} open={show} onOk={handleSumbit} onCancel={onCancel} destroyOnClose={false}>
			<Form
				// initialValues={formValue}
				form={form}
				name="roleListModal"
				labelCol={{ span: 6 }}
				wrapperCol={{ span: 18 }}
				layout="horizontal"
			>
				<Form.Item<RoleListType> label="Role" name="role" rules={[{ required: true, message: t("common.inputText") }]}>
					<Input />
				</Form.Item>

				<Form.Item<RoleListType>
					label="RoleName"
					name="roleName"
					rules={[{ required: true, message: t("common.inputText") }]}
				>
					<Input />
				</Form.Item>

				<Form.Item<RoleListType>
					label="Status"
					name="status"
					rules={[{ required: true, message: t("common.chooseText") }]}
				>
					<Radio.Group optionType="button" buttonStyle="solid">
						{getEnumOptions(StatusEnum).map(({ label, value }) => (
							<Radio key={value} value={value}>
								{label}
							</Radio>
						))}
					</Radio.Group>
				</Form.Item>

				<Form.Item<RoleListType> label="Desc" name="desc" rules={[{ required: true, message: t("common.inputText") }]}>
					<Input.TextArea />
				</Form.Item>

				{/* <Form.Item<Role> label="Permission" name="permission">
					<Tree
						checkable
						checkedKeys={checkedKeys}
						treeData={PERMISSIONS}
						fieldNames={{
							key: "id",
							children: "children",
							title: "name",
						}}
					/>
				</Form.Item> */}
			</Form>
		</Modal>
	);
});
