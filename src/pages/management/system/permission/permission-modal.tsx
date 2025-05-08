import type { MenuOptions } from "@/api/types";

import { AutoComplete, Form, Input, InputNumber, Modal, Radio, TreeSelect } from "antd";
import { useCallback, useEffect, useState } from "react";

import { useUserPermission } from "@/store/userStore";
import { t } from "i18next";
import { toast } from "sonner";
import { PermissionType } from "#/enum";
// Constants
const ENTRY_PATH = "/src/pages";
const PAGES = import.meta.glob("/src/pages/**/*.tsx");
const PAGE_SELECT_OPTIONS = Object.entries(PAGES).map(([path]) => {
	const pagePath = path.replace(ENTRY_PATH, "");
	return {
		label: pagePath,
		value: pagePath,
	};
});

export type PermissionModalProps = {
	formValue: MenuOptions;
	title: string;
	show: boolean;
	onOk: (values: MenuOptions) => void;
	onCancel: VoidFunction;
};

// 管理/系统/权限
export default function PermissionModal({ title, show, formValue, onOk, onCancel }: PermissionModalProps) {
	const [form] = Form.useForm();
	// const [formValues, setFormValues] = useState<any>();
	const permissions = useUserPermission();
	const [compOptions, setCompOptions] = useState(PAGE_SELECT_OPTIONS);

	const getParentNameById = useCallback(
		(parentId: number | null, data: MenuOptions[] | undefined = permissions) => {
			let name = "";
			if (!data || !parentId) return name;
			for (let i = 0; i < data.length; i += 1) {
				if (data[i].id === parentId) {
					name = data[i].name;
				} else if (data[i].children) {
					name = getParentNameById(parentId, data[i].children);
				}
				if (name) {
					break;
				}
			}
			return name;
		},
		[permissions],
	);

	const updateCompOptions = (name: string) => {
		if (!name) return;
		setCompOptions(
			PAGE_SELECT_OPTIONS.filter((path) => {
				return path.value.includes(name.toLowerCase());
			}),
		);
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		console.log("children(formValue)", formValue);
		form.setFieldsValue({ ...formValue });
		if (formValue.parentId) {
			const parentName = getParentNameById(formValue.parentId);
			updateCompOptions(parentName);
		}
	}, [formValue, form, getParentNameById]);

	const handleSumbit = async () => {
		try {
			// 校验表单字段
			const values = await form.validateFields();
			// 如果校验通过，调用父组件的 onOk 回调
			console.log("submit", values);
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

	return (
		<Modal
			forceRender
			title={title}
			open={show}
			onOk={handleSumbit}
			onCancel={() => {
				form.resetFields();
				onCancel();
			}}
			okButtonProps={{ autoFocus: true, htmlType: "submit" }}
			modalRender={(dom) => (
				<Form
					form={form}
					name="form_in_modal"
					initialValues={formValue}
					clearOnDestroy
					// onFinish={(values) => {
					// 	console.log("子组件", values);
					// 	onCreate(values);
					// }}
					labelCol={{ span: 6 }}
					wrapperCol={{ span: 18 }}
					layout="horizontal"
				>
					{dom}
				</Form>
			)}
		>
			{/* <Form initialValues={formValue} form={form} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }} layout="horizontal"> */}
			<Form.Item<MenuOptions>
				label="Type"
				name="type"
				rules={[{ required: true, message: t("common.chooseText") }]}
				tooltip="menus type"
			>
				<Radio.Group optionType="button" buttonStyle="solid">
					<Radio value={PermissionType.CATALOGUE}>CATALOGUE</Radio>
					<Radio value={PermissionType.MENU}>MENU</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item<MenuOptions> label="Name" name="name" rules={[{ required: true, message: t("common.inputText") }]}>
				<Input placeholder={t("common.inputText")} />
			</Form.Item>

			<Form.Item<MenuOptions>
				label="Label"
				name="label"
				rules={[{ required: true, message: t("common.inputText") }]}
				tooltip="internationalization config"
			>
				<Input placeholder={t("common.inputText")} />
			</Form.Item>

			<Form.Item<MenuOptions> label="Parent" name="parentId" required tooltip="parent level">
				<TreeSelect
					fieldNames={{
						label: "name",
						value: "id",
						children: "children",
					}}
					allowClear
					treeData={permissions}
					onChange={(_value, labelList) => {
						updateCompOptions(labelList[0] as string);
					}}
					placeholder={t("common.chooseText")}
				/>
			</Form.Item>

			<Form.Item<MenuOptions> label="Path" name="path" rules={[{ required: true, message: t("common.inputText") }]}>
				<Input placeholder={t("common.inputText")} />
			</Form.Item>

			<Form.Item noStyle shouldUpdate={(prevValues, currentValues) => prevValues.type !== currentValues.type}>
				{({ getFieldValue }) => {
					if (getFieldValue("type") === PermissionType.MENU) {
						return (
							<Form.Item<MenuOptions>
								label="Component"
								name="component"
								required={getFieldValue("type") === PermissionType.MENU}
							>
								<AutoComplete
									placeholder={t("common.chooseText")}
									allowClear
									options={compOptions}
									filterOption={(input, option) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase())}
								/>
							</Form.Item>
						);
					}
					return null;
				}}
			</Form.Item>

			<Form.Item<MenuOptions> label="Icon" name="icon" tooltip="local icon should start with ic">
				<Input placeholder={t("common.inputText")} />
			</Form.Item>

			<Form.Item<MenuOptions> label="Hide" name="hideMenu" tooltip="hide in menu" required>
				<Radio.Group optionType="button" buttonStyle="solid">
					<Radio value={false}>Show</Radio>
					<Radio value={true}>Hide</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item<MenuOptions> label="NewFeature" name="newFeature" tooltip="new identification display" required>
				<Radio.Group optionType="button" buttonStyle="solid">
					<Radio value={true}>Show</Radio>
					<Radio value={false}>Hide</Radio>
				</Radio.Group>
			</Form.Item>

			<Form.Item<MenuOptions> label="Order" name="order" rules={[{ required: true, message: t("common.inputText") }]}>
				<InputNumber style={{ width: "100%" }} />
			</Form.Item>

			<Form.Item<MenuOptions> label="Status" name="disabled" required>
				<Radio.Group optionType="button" buttonStyle="solid">
					<Radio value={false}> Enable </Radio>
					<Radio value={true}> Disable </Radio>
				</Radio.Group>
			</Form.Item>
			{/* </Form> */}
		</Modal>
	);
}
