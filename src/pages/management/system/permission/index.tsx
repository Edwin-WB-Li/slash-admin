import type { MenuOptions } from "@/api/types";
import type { TableColumnsType } from "antd";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag } from "antd";
import Table from "antd/es/table";
import { isNil } from "ramda";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { menuService } from "@/api/services";
import { IconButton, Iconify, SvgIcon } from "@/components/icon";
import { menusOrderFilter } from "@/router/utils";
import { BasicStatus, PermissionType } from "#/enum";
import PermissionModal from "./permission-modal";

const DEFAULE_PERMISSION_VALUE: MenuOptions = {
	parentId: null,
	name: "",
	label: "",
	path: "",
	component: "",
	icon: "",
	order: 1,
	hideMenu: false,
	hideTab: false,
	disabled: false,
	newFeature: false,
	type: PermissionType.CATALOGUE,
};

export default function PermissionPage() {
	const { t } = useTranslation();
	const [title, setTitle] = useState("");
	const [formValue, setFormValue] = useState<MenuOptions>(DEFAULE_PERMISSION_VALUE);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const queryClient = useQueryClient();
	/**
	 * @description Columns
	 */
	const columns: TableColumnsType<MenuOptions> = [
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
						// <IconButton onClick={() => onCreate(record.id)}>
						<IconButton onClick={() => handleCreatedOrEdit("Create", record)}>
							<Iconify icon="gridicons:add-outline" size={18} />
						</IconButton>
					)}
					{/* <IconButton onClick={() => onEdit(record)}> */}
					<IconButton onClick={() => handleCreatedOrEdit("Edit", record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm
						title="Delete the Permission"
						okText="Yes"
						cancelText="No"
						placement="left"
						onConfirm={() => handleConfirmDelete(record.id as number)}
					>
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	/**
	 * @description 获取所有的菜单列表
	 */
	const { data: allPermissions } = useQuery({
		queryKey: ["allPermissions"],
		queryFn: async () => {
			const res = await menuService.getAllMenus();
			return res ?? [];
		},
		enabled: true,
	});

	const createOrEditMenusMutation = useMutation({
		mutationFn: async (params: MenuOptions) => {
			const server = title === "Edit" ? menuService.editMenus(params) : menuService.createMenus(params);
			return await server;
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				toast.success(`${title} Success`, {
					position: "top-center",
				});
				queryClient.invalidateQueries({ queryKey: ["allPermissions"] }); // 刷新表格数据
				setShowPermissionModal(false);
			}
		},
	});

	const deletedRoleMutation = useMutation({
		mutationFn: async (ids: number[]) => {
			return await menuService.deleteMenus(ids);
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				toast.success("Delete Success", {
					position: "top-center",
				});
				queryClient.invalidateQueries({ queryKey: ["allPermissions"] });
			}
		},
	});

	const handleCreatedOrEdit = async (type: string, formValue?: MenuOptions) => {
		setTitle(type);
		if (type === "Create") {
			setFormValue({ ...DEFAULE_PERMISSION_VALUE, parentId: formValue?.id ?? null });
		} else {
			if (formValue) {
				setFormValue({ ...formValue, id: formValue.id });
			}
		}
		setShowPermissionModal(true);
	};

	/**
	 * @description 删除角色
	 * @param ids
	 */
	const handleConfirmDelete = (ids: number) => {
		deletedRoleMutation.mutateAsync([ids]);
	};

	/**
	 * @description 提交表单
	 * @param value
	 */
	const handleSumbit = async (value: MenuOptions) => {
		console.log("提交", value);
		if (value) {
			const params = {
				...value,
			};
			await createOrEditMenusMutation.mutateAsync(params);
		}
	};

	return (
		<Card
			title="Permission List"
			extra={
				<Button type="primary" onClick={() => handleCreatedOrEdit("Create")}>
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
				dataSource={menusOrderFilter(allPermissions ?? [])}
			/>
			<PermissionModal
				title={title}
				formValue={formValue}
				show={showPermissionModal}
				onCancel={() => setShowPermissionModal(false)}
				onOk={(value) => handleSumbit(value)}
			/>
		</Card>
	);
}
