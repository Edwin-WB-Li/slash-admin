import type { RoleListType } from "@/api/types";
import type { ColumnsType } from "antd/es/table";
import type { RoleModalRef } from "./role-modal";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag } from "antd";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { useRef, useState } from "react";

import { roleService } from "@/api/services";
import { IconButton, Iconify } from "@/components/icon";
// import { t } from "i18next";
import { toast } from "sonner";
import { StatusEnum } from "#/enum";
import { RoleModal } from "./role-modal";

const DEFAULE_ROLE_VALUE: RoleListType = {
	role: "",
	roleName: "",
	status: StatusEnum.Enabled,
	desc: "",
	// permission: [],
};
export default function RolePage() {
	const columns: ColumnsType<RoleListType> = [
		{
			title: "ID",
			dataIndex: "id",
			render: (id) => <Tag color="cyan">{id}</Tag>,
		},
		{
			title: "Role",
			dataIndex: "role",
			render: (role) => <Tag color="cyan">{role}</Tag>,
		},
		{
			title: "RoleName",
			dataIndex: "roleName",
			render: (roleName) => <Tag color="cyan">{roleName}</Tag>,
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => <Tag color={status === StatusEnum.Disabled ? "error" : "success"}>{StatusEnum[status]}</Tag>,
		},
		{ title: "Desc", dataIndex: "desc" },
		{
			title: "CreatedTime",
			dataIndex: "createdTime",
			render: (createdTime) => <Tag color="cyan">{dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss")}</Tag>,
		},
		{
			title: "UpdatedTime",
			dataIndex: "updatedTime",
			render: (updatedTime) => <Tag color="cyan">{dayjs(updatedTime).format("YYYY-MM-DD HH:mm:ss")}</Tag>,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray">
					<IconButton onClick={() => onEdit(record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the Role" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const [formValue, setFormValue] = useState<RoleListType>(DEFAULE_ROLE_VALUE);
	const [showPermissionModal, setShowPermissionModal] = useState(false);
	const [title, setTitle] = useState("");

	const roleModalRef = useRef<RoleModalRef>(null);
	const queryClient = useQueryClient();

	const { isPending: tableLoading, data: roleListData } = useQuery({
		queryKey: ["roleList"],
		queryFn: async () => {
			const res = await roleService.getRoleList();
			// 保证返回值不是 undefined
			return res ?? [];
		},
		enabled: true,
	});

	/**
	 * @description 创建或者编辑角色 mutation 方法
	 */
	const createOrEditRoleMutation = useMutation({
		mutationFn: async (params: RoleListType) => {
			return await roleService.createOrEditRole(params);
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				toast.success(`${title} Success`, {
					position: "top-center",
				});
				queryClient.invalidateQueries({ queryKey: ["roleList"] }); // 刷新表格数据
			}
		},
		// onError: (error, variables, context) => {
		// 	// 失败回调
		// },
		// onSettled: (data, error, variables, context) => {
		// 	// 无论成功失败都会调用
		// },
	});

	const onCreate = () => {
		setTitle("Create");
		setFormValue(DEFAULE_ROLE_VALUE);
		setShowPermissionModal(true);
	};

	const onEdit = (formValue: RoleListType) => {
		setShowPermissionModal(true);
		setTitle("Edit");
		setFormValue({ ...formValue });
	};

	/**
	 * @description 提交表单
	 * @param value
	 */
	const handleSumbit = (value: RoleListType) => {
		console.log("提交", value);
		createOrEditRoleMutation.mutate(value); // 触发接口调用
		setShowPermissionModal(false);
	};

	// 关闭弹窗时调用
	const handleCloseModal = () => {
		// roleModalRef.current?.resetFields();
		setShowPermissionModal(false);
	};

	return (
		<Card
			title="Role List"
			extra={
				<Button type="primary" onClick={onCreate}>
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
				dataSource={roleListData ?? []}
				loading={tableLoading}
			/>
			<RoleModal
				ref={roleModalRef}
				title={title}
				show={showPermissionModal}
				formValue={formValue}
				onOk={(value) => handleSumbit(value)}
				onCancel={handleCloseModal}
			/>
		</Card>
	);
}
