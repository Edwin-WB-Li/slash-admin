import type { UserInfoType, UserListParams } from "@/api/types";
import type { FormProps, PaginationProps } from "antd";
import type { ColumnsType } from "antd/es/table";

import { useQuery } from "@tanstack/react-query";
import { Button, Card, Col, DatePicker, Form, Input, Pagination, Popconfirm, Row, Select, Space, Tag } from "antd";
import Table from "antd/es/table";
import dayjs from "dayjs";
import { t } from "i18next";
import { useState } from "react";

import { roleService, userService } from "@/api/services";
import { IconButton, Iconify } from "@/components/icon";
import { usePathname, useRouter } from "@/router/hooks";

const { RangePicker } = DatePicker;

const initialValues: UserListParams = {
	username: "",
	role: null,
	nickName: "",
	status: true,
	isDeleted: false,
	createdTime: [],
	page: 1,
	pageSize: 5,
};

export default function UserListPage() {
	const { push } = useRouter();
	const [form] = Form.useForm();
	const pathname = usePathname();
	const [params, setParams] = useState<UserListParams>(initialValues);

	const columns: ColumnsType<UserInfoType> = [
		{
			title: "Name",
			dataIndex: "name",
			width: 300,
			render: (_, record) => {
				return (
					<div className="flex">
						<img alt="" src={record.avatar} className="h-10 w-10 rounded-full" />
						<div className="ml-2 flex flex-col">
							<span className="text-sm">{record.nickName}</span>
							<span className="text-xs text-text-secondary">{record.email}</span>
						</div>
					</div>
				);
			},
		},
		{
			title: "Role",
			dataIndex: "role",
			align: "center",
			width: 120,
			render: (role) => <Tag color="cyan">{role}</Tag>,
		},
		{
			title: "Mobile",
			dataIndex: "mobile",
			align: "center",
			width: 120,
			render: (mobile) => <Tag color="cyan">{mobile}</Tag>,
		},
		{
			title: "Status",
			dataIndex: "status",
			align: "center",
			width: 120,
			render: (status) => <Tag color={status ? "success" : "error"}>{status ? "Enabled" : "Disabled"}</Tag>,
		},
		{
			title: "CreatedTime",
			dataIndex: "createdTime",
			align: "center",
			width: 120,
			render: (createdTime) => <Tag color="cyan">{dayjs(createdTime).format("YYYY-MM-DD HH:mm:ss")}</Tag>,
		},
		{
			title: "UpdatedTime",
			dataIndex: "updatedTime",
			align: "center",
			width: 120,
			render: (updatedTime) => <Tag color="cyan">{dayjs(updatedTime).format("YYYY-MM-DD HH:mm:ss")}</Tag>,
		},
		{
			title: "Action",
			key: "operation",
			align: "center",
			width: 100,
			render: (_, record) => (
				<div className="flex w-full justify-center text-gray-500">
					<IconButton
						onClick={() => {
							push(`${pathname}/${record.id}`);
						}}
					>
						<Iconify icon="mdi:card-account-details" size={18} />
					</IconButton>
					<IconButton onClick={() => {}}>
						<Iconify icon="solar:pen-bold-duotone" size={18} />
					</IconButton>
					<Popconfirm title="Delete the User" okText="Yes" cancelText="No" placement="left">
						<IconButton>
							<Iconify icon="mingcute:delete-2-fill" size={18} className="text-error" />
						</IconButton>
					</Popconfirm>
				</div>
			),
		},
	];

	const { isPending: tableLoading, data: tableData } = useQuery({
		queryKey: ["userList", params],
		queryFn: async () => {
			const formattedParams = {
				...params,
				createdTime: params.createdTime?.map((t) => dayjs(t).format("YYYY-MM-DD")) ?? [],
			};
			const res = await userService.getUserList(formattedParams);
			// 保证返回值不是 undefined
			return res ?? { list: [], total: 0 };
		},
		enabled: true,
	});

	const { data: roleListData } = useQuery({
		queryKey: ["roleList"],
		queryFn: async () => {
			const res = await roleService.getRoleList();
			// 保证返回值不是 undefined
			return res ?? [];
		},
		enabled: true,
	});

	const onFinish: FormProps<UserListParams>["onFinish"] = (values) => {
		setParams((prev) => ({
			...values,
			page: 1, // 搜索时重置到第一页
			pageSize: prev.pageSize,
		}));
	};

	const onPageChange: PaginationProps["onChange"] = (page, pageSize) => {
		setParams((prev) => ({
			...prev,
			// pageSize 改变时重置到第一页
			page: params.pageSize === pageSize ? page : 1,
			pageSize,
		}));
	};

	const onFinishFailed: FormProps<UserListParams>["onFinishFailed"] = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	// 重置表单处理
	const handleReset = () => {
		form.resetFields();
		setParams(initialValues);
	};

	return (
		<Space direction="vertical" size="large" className="w-full">
			<Card>
				<Form
					name="userListForm"
					layout="inline"
					form={form}
					labelCol={{ span: 10 }}
					wrapperCol={{ span: 14 }}
					// style={{ maxWidth: 600 }}
					initialValues={initialValues}
					onFinish={onFinish}
					onFinishFailed={onFinishFailed}
					autoComplete="off"
				>
					<Row gutter={[16, 16]}>
						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="Username" name="username">
								<Input placeholder={t("common.inputText")} />
							</Form.Item>
						</Col>

						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="Role" name="role">
								<Select
									// onChange={handleChange}
									placeholder={t("common.chooseText")}
									showSearch
									allowClear
									options={
										roleListData?.map((item) => ({
											label: item.roleName,
											value: item.role,
										})) ?? []
									}
								/>
							</Form.Item>
						</Col>

						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="NickName" name="nickName">
								<Input placeholder={t("common.inputText")} />
							</Form.Item>
						</Col>

						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="Status" name="status">
								<Select placeholder={t("common.chooseText")}>
									<Select.Option value={true}>
										<Tag color="success">Enabled</Tag>
									</Select.Option>
									<Select.Option value={false}>
										<Tag color="error">Disabled</Tag>
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="isDelete" name="isDeleted">
								<Select placeholder={t("common.chooseText")}>
									<Select.Option value={true}>
										<Tag color="success">Yes</Tag>
									</Select.Option>
									<Select.Option value={false}>
										<Tag color="error">No</Tag>
									</Select.Option>
								</Select>
							</Form.Item>
						</Col>

						<Col span={24} lg={6}>
							<Form.Item<UserListParams> label="CreatedTime" name="createdTime">
								<RangePicker format="YYYY-MM-DD" />
							</Form.Item>
						</Col>

						<Col span={24} lg={12}>
							{/* <div className="flex justify-end"> */}
							{/* <Form.Item label={null}> */}
							<Space>
								<Button type="primary" onClick={handleReset}>
									{t("common.resetText")}
								</Button>
								<Button type="primary" htmlType="submit">
									{t("common.queryText")}
								</Button>
							</Space>
							{/* </Form.Item> */}
							{/* </div> */}
						</Col>
					</Row>
				</Form>
			</Card>
			<Card
				title="User List"
				extra={
					<Button type="primary" onClick={() => {}}>
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
					dataSource={tableData?.list ?? []}
					loading={tableLoading}
				/>
				<div className="flex justify-end mt-4">
					<Pagination
						total={tableData?.total ?? 0}
						showSizeChanger
						showQuickJumper
						current={params.page}
						pageSize={params.pageSize}
						onChange={onPageChange}
						pageSizeOptions={[1, 2, 5, 10, 20, 50]}
						showTotal={(total) => `Total ${total}`}
					/>
				</div>
			</Card>
		</Space>
	);
}
