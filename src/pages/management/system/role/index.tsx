import type { AssignMenusToRoleParamsType, MenuOptions, RoleListType } from "@/api/types";
import type { TableColumnsType } from "antd";
import type { RoleModalRef } from "./role-modal";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Card, Popconfirm, Tag } from "antd";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { menuService, roleService } from "@/api/services";
import { IconButton, Iconify } from "@/components/icon";
// import { t } from "i18next";
import { processPermissions } from "@/utils";
import { StatusEnum } from "#/enum";
import { RoleModal } from "./role-modal";

const DEFAULE_ROLE_VALUE: RoleListType = {
	role: "",
	roleName: "",
	status: StatusEnum.Enabled,
	desc: "",
	// permission: [],
};
export default function RoleListPage() {
	const columns: TableColumnsType<RoleListType> = [
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
					{/* <IconButton onClick={() => onEdit(record)}> */}
					<IconButton onClick={() => handleCreatedOrEdit("Edit", record)}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					{/* <IconButton onClick={() => handlePermission(record.id as number)}>
						<Iconify icon="solar:lock-keyhole-minimalistic-unlocked-broken" size={18} />
					</IconButton> */}
					<Popconfirm
						title="Delete the Role"
						okText="Yes"
						cancelText="No"
						onConfirm={() => handleConfirmDelete(record.id as number)}
						placement="left"
					>
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
	const [roleId, setRoleId] = useState<any>(null);
	const roleModalRef = useRef<RoleModalRef>(null);
	const queryClient = useQueryClient();
	const [defaultCheckedKeys, setDefaultCheckedKeys] = useState<React.Key[]>([]);

	/**
	 * @description 获取角色列表
	 */
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
	 * @description 获取某个角色的菜单列表
	 */
	const { data: roleMenusData, refetch: fetchRoleMenus } = useQuery({
		queryKey: ["roleMenus", roleId],
		queryFn: async () => {
			const res = await roleService.getRoleMenusByRoleId(roleId);
			return res ?? [];
		},
		enabled: false,
	});

	/**
	 * @description 获取所有的菜单列表
	 */
	const { data: allPermissions, refetch: fetchAllPermissions } = useQuery({
		queryKey: ["allMenus"],
		queryFn: async () => {
			const res = await menuService.getAllMenus();
			return res ?? [];
		},
		enabled: false,
	});

	/**
	 * @description 创建或者编辑角色的 mutation 方法
	 */
	const createOrEditRoleMutation = useMutation({
		mutationFn: async (params: RoleListType) => {
			return await roleService.createOrEditRole(params);
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				// toast.success(`${title} Success`, {
				// 	position: "top-center",
				// });
				queryClient.invalidateQueries({ queryKey: ["roleList"] }); // 刷新表格数据
			}
		},
	});

	/**
	 * @description 删除角色的 mutation 方法
	 */
	const deletedRoleMutation = useMutation({
		mutationFn: async (params: number[]) => {
			return await roleService.deletedRole(params);
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				toast.success("Deleted Success", {
					position: "top-center",
				});
				queryClient.invalidateQueries({ queryKey: ["roleList"] }); // 刷新表格数据
			}
		},
	});
	/**
	 * @description 分配角色权限的 mutation 方法
	 */
	const AssignMenusToRoleMutation = useMutation({
		mutationFn: async (params: AssignMenusToRoleParamsType) => {
			return await roleService.assignMenusToRole(params);
		},
		onSuccess: (data) => {
			// 成功回调
			if (data) {
				// toast.success("Assign Success", {
				// 	position: "top-center",
				// });
				queryClient.invalidateQueries({ queryKey: ["roleList"] }); // 刷新表格数据
			}
		},
	});

	useEffect(() => {
		if (!roleId) return;
		fetchRoleMenus();
	}, [roleId, fetchRoleMenus]);

	const handleCreatedOrEdit = async (type: string, formValue?: RoleListType) => {
		setTitle(type);
		await fetchAllPermissions();
		if (type === "Create") {
			setFormValue(DEFAULE_ROLE_VALUE);
			setDefaultCheckedKeys([]);
		} else {
			if (formValue) {
				setFormValue({ ...formValue });
				setRoleId(formValue?.id);
			}
		}
		setShowPermissionModal(true);
	};

	useEffect(() => {
		if (title === "Edit") {
			if (allPermissions && allPermissions?.length > 0) {
				const permissions = formValue?.permissions;
				const processed = processPermissions(allPermissions as MenuOptions[], permissions as number[]);
				setDefaultCheckedKeys(processed ?? []);
			}
		}
	}, [allPermissions, formValue, title]);

	/**
	 * @description 删除角色
	 * @param id
	 */
	const handleConfirmDelete = (id: number) => {
		deletedRoleMutation.mutateAsync([id]);
	};

	/**
	 * @description 提交表单
	 * @param value
	 */
	const handleSumbit = (value: RoleListType | number[], permissions?: number[]) => {
		console.log("提交", value, permissions);
		// 先保存角色
		const promise = createOrEditRoleMutation.mutateAsync(value as RoleListType).then((role) => {
			console.log("createOrEditRole", role);
			if (!role) return;
			// 角色创建成功后再分配权限
			return AssignMenusToRoleMutation.mutateAsync({
				roleId: role?.id as number, // 创建时用新角色id，编辑时用当前角色id
				menuIds: (permissions as number[]) ?? [],
			});
		});
		// .then(() => {
		// 	setShowPermissionModal(false);
		// });

		toast.promise(promise, {
			position: "top-center",
			loading: `${title}...`,
			success: `${title} Success`,
			error: `${title} Error`,
		});

		promise.then(() => {
			setShowPermissionModal(false);
		});

		// Promise.all([
		// 	createOrEditRoleMutation.mutateAsync(value as RoleListType),
		// 	AssignMenusToRoleMutation.mutateAsync({
		// 		roleId: roleMenusParams,
		// 		menuIds: value as number[],
		// 	}),
		// ])
		// 	.then(([roleRes, assignRes]) => {
		// 		// 两个接口都成功
		// 		setShowPermissionModal(false);
		// 	})
		// 	.catch((err) => {
		// 		// 有一个失败
		// 	});
	};

	return (
		<Card
			title="Role List"
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
				dataSource={roleListData ?? []}
				loading={tableLoading}
			/>
			<RoleModal
				ref={roleModalRef}
				title={title}
				currentPermissions={roleMenusData ?? []}
				allPermissions={allPermissions ?? []}
				show={showPermissionModal}
				formValue={formValue}
				defaultCheckedKeys={defaultCheckedKeys}
				onOk={(value, permission) => handleSumbit(value, permission)}
				onCancel={() => setShowPermissionModal(false)}
			/>
		</Card>
	);
}
