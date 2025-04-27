import type { MenuOptions, RoleListType } from "@/api/types";
import type { TreeDataNode, TreeProps } from "antd";

import { Form, Input, Modal, Radio, Tree } from "antd";
import { t } from "i18next";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { toast } from "sonner";

import { menusOrderFilter } from "@/router/utils";
import { getEnumOptions } from "@/utils";
// import { flattenTrees } from "@/utils/tree";
import { StatusEnum } from "#/enum";

export type RoleModalProps = {
	formValue: RoleListType;
	title: string;
	show: boolean;
	currentPermissions?: MenuOptions[];
	allPermissions: MenuOptions[];
	defaultCheckedKeys: React.Key[];
	onOk: (values: RoleListType | number[], permission?: number[]) => void;
	onCancel: VoidFunction;
};

export interface RoleModalRef {
	resetFields: () => void;
}

// export function RoleModal({ title, show, formValue, onOk, onCancel }: RoleModalProps) {
export const RoleModal = forwardRef<RoleModalRef, RoleModalProps>(function RoleModal(
	{ title, show = false, formValue, onOk, onCancel, defaultCheckedKeys = [], allPermissions = [] },
	ref,
) {
	const [form] = Form.useForm();
	useImperativeHandle(ref, () => ({
		resetFields: () => form.resetFields(),
	}));

	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>(defaultCheckedKeys);
	const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
	const [parentCheckedKeys, setParentCheckedKeys] = useState<React.Key[]>([]);

	useEffect(() => {
		console.log("defaultCheckedKeys", defaultCheckedKeys);
		// 初始化时设置默认选中的权限
		if (defaultCheckedKeys?.length > 0) setCheckedKeys(defaultCheckedKeys);
	}, [defaultCheckedKeys]);

	useEffect(() => {
		console.log(formValue);
		form.setFieldsValue({ ...formValue });
	}, [formValue, form]);

	useEffect(() => {
		if (show && title === "Create") {
			setCheckedKeys([6, 7, 8]);
		}
	}, [title, show]);

	const handleSumbit = async () => {
		try {
			// 校验表单字段
			const values = await form.validateFields();
			// 如果校验通过，调用父组件的 onOk 回调
			if (title === "Edit") {
				const mergedValues = { id: formValue.id, ...values };
				onOk(mergedValues, [...(checkedKeys as number[]), ...(parentCheckedKeys as number[])]);
			} else {
				onOk(values, [...(checkedKeys as number[]), ...(parentCheckedKeys as number[])]);
			}
		} catch (error) {
			console.log("表单校验失败", error);
			toast.error(t("common.perfectTheForm"), {
				position: "top-center",
			});
		}
	};

	useEffect(() => {
		console.log("checkedKeys", checkedKeys);
	}, [checkedKeys]);

	const onCheck: TreeProps["onCheck"] = (checkedKeys, info) => {
		console.log("onCheck", checkedKeys, info);
		setCheckedKeys(checkedKeys as React.Key[]);
		setParentCheckedKeys((info?.halfCheckedKeys as React.Key[]) ?? []);
	};

	const onSelect: TreeProps["onSelect"] = (selectedKeysValue, info) => {
		console.log("onSelect", selectedKeysValue, info);
		setSelectedKeys(selectedKeysValue);
	};

	function menuOptionsToDataNodes(menus: MenuOptions[]): TreeDataNode[] {
		const defaultDisabledKeys = [6, 7, 8]; // 假设这些是你想要禁用的节点的 key
		return menus.map((item) => ({
			key: item.id as React.Key, // 用 id 作为 key
			title: item.name, // 或其他你想展示的字段
			disabled: defaultDisabledKeys.includes(item.id as number), // 禁用节点
			children: item.children ? menuOptionsToDataNodes(item.children) : undefined,
			// ...item, // 保留其他属性（可选）
		}));
	}

	return (
		<Modal title={title} open={show} onOk={handleSumbit} onCancel={onCancel} destroyOnClose>
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

				<Form.Item<RoleListType> label="Permission" name="permissions" required>
					<Tree
						checkable
						checkedKeys={checkedKeys}
						onCheck={onCheck}
						onSelect={onSelect}
						selectedKeys={selectedKeys}
						treeData={menuOptionsToDataNodes(menusOrderFilter(allPermissions as MenuOptions[]))}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
});
