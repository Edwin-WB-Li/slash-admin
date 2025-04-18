import type { MenuOptions } from "@/api/types";
import type { ColumnsType } from "antd/es/table";
import type { PermissionModalProps } from "./permission-modal";

import { useMutation } from "@tanstack/react-query";
// import { useQuery } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag } from "antd";
import Table from "antd/es/table";
import { isNil } from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { menuService, roleService } from "@/api/services";
import { IconButton, Iconify, SvgIcon } from "@/components/icon";
import { menusOrderFilter } from "@/router/utils";
import { useUserPermission } from "@/store/userStore";
import { BasicStatus, PermissionType } from "#/enum";
import PermissionModal from "./permission-modal";

const defaultPermissionValue: MenuOptions = {
	parentId: null,
	name: "",
	label: "",
	path: "",
	component: "",
	icon: "",
	hideMenu: false,
	hideTab: false,
	disabled: !!BasicStatus.ENABLE,
	newFeature: false,
	type: PermissionType.CATALOGUE,
};

export default function PermissionPage() {
	const { t } = useTranslation();
	const permissions = useUserPermission();
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [type, setType] = useState("");

	const editMenusMutation = useMutation({
		mutationFn: menuService.editMenus,
	});
	// const { data } = useQuery({
	// 	queryKey: ["roleMenus"],
	// 	queryFn: roleService.getRoleMenus(1),
	// });

	/**
	 * @description Columns
	 */
	const columns: ColumnsType<MenuOptions> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => <div>{t(record.label)}</div>,
		},
		{
			title: "Type",
			dataIndex: "type",
			width: 60,
			render: (_, record) => <Tag color="processing">{PermissionType[record.type]}</Tag>,
		},
		{
			title: "Icon",
			dataIndex: "icon",
			width: 60,
			render: (icon: string) => {
				if (isNil(icon)) return "";
				if (icon.startsWith("ic")) {
					return <SvgIcon icon={icon} size={18} className="ant-menu-item-icon" />;
				}
				return <Iconify icon={icon} size={18} className="ant-menu-item-icon" />;
			},
		},
		{
			title: "Component",
			dataIndex: "component",
		},
		{
			title: "Status",
			dataIndex: "disabled",
			align: "center",
			width: 120,
			render: (status) => (
				<Tag color={status === !BasicStatus.DISABLE ? "error" : "success"}>
					{status === BasicStatus.DISABLE ? "Disable" : "Enable"}
				</Tag>
			),
		},
		{ title: "Order", dataIndex: "order", width: 60 },
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-end text-gray">
					{record?.type === PermissionType.CATALOGUE && (
						<IconButton onClick={() => onCreate(record.id)}>
							<Iconify icon="gridicons:add-outline" size={18} />
						</IconButton>
					)}
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the Permission" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const [permissionModalProps, setPermissionModalProps] = useState<PermissionModalProps>({
		formValue: { ...defaultPermissionValue },
		title: "New",
		show: false,
		onOk: (value) => handleSumbit(value),
		onCancel: () => {
			setPermissionModalProps((prev) => ({ ...prev, show: false }));
		},
	});

	/**
	 * @description 提交表单
	 * @param value
	 */
	const handleSumbit = (value: MenuOptions) => {
		console.log("提交", value);

		if (value) {
			const params = {
				...value,
				disabled: !!value.disabled,
			};
			if (type === "edit") {
				handleEditMenus(params);
			} else {
				roleService.createRoleMenus(params).then((res) => {
					console.log("res", res);
					if (res) {
						toast.success("success", {
							position: "top-center",
						});
						setShowPermissionModal(false);
					}
				});
			}
		}
	};

	/**
	 * @description Create a new Menus
	 * @param parentId
	 */
	const onCreate = (parentId?: number | null) => {
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			// ...defaultPermissionValue,
			title: "New",
			formValue: { ...defaultPermissionValue, parentId: parentId ?? null },
		}));
		setShowPermissionModal(true);
		setType("new");
	};

	const handleEditMenus = (formValue: MenuOptions) => {
		console.log("edit", formValue);
		try {
			const data = editMenusMutation.mutate(formValue);
			console.log("edit", data);
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * @description Edit a Menus
	 * @param formValue
	 */
	const onEdit = async (formValue: MenuOptions) => {
		console.log(formValue);
		setPermissionModalProps((prev) => ({
			...prev,
			show: true,
			title: "Edit",
			formValue: { ...formValue, id: formValue.id },
		}));
		setShowPermissionModal(true);
		setType("edit");
	};

	return (
		<Card
			title="Permission List"
			extra={
				<Button type="primary" onClick={() => onCreate()}>
					New
				</Button>
			}
		>
			<Table
				rowKey="id"
				size="small"
				scroll={{ x: "max-content" }}
				pagination={false}
				columns={columns}
				dataSource={menusOrderFilter(permissions)}
			/>
			<PermissionModal
				{...permissionModalProps}
				show={showPermissionModal}
				onCancel={() => setShowPermissionModal(false)}
				onOk={(value) => handleSumbit(value)}
			/>
		</Card>
	);
}
