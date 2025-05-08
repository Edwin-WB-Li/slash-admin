import { Card, Col, Row, Space, Switch, Tabs, type TabsProps, Typography } from "antd";
import { useState } from "react";
import { toast } from "sonner";

import { Iconify } from "@/components/icon";
import { Upload, UploadAvatar, UploadBox } from "@/components/upload";

export default function UploadPage() {
	const [thumbnail, setThumbnail] = useState<boolean>(false);

	const onChange = (checked: boolean) => {
		setThumbnail(checked);
	};

	const handleOnChange = (info: { file: { name?: string; status?: string }; fileList: any }) => {
		const { status } = info.file;
		console.log("status", status);
		if (status !== "uploading") {
			console.log(info.file, info.fileList);
		}
		if (status === "done") {
			toast.success(`${info.file.name} file uploaded successfully.`, {
				position: "top-center",
			});
		} else if (status === "error") {
			toast.error(`${info.file.name} file uploaded failed.`, {
				position: "top-center",
			});
		}
	};

	const ThumbnailSwitch = <Switch size="small" checked={thumbnail} onChange={onChange} />;

	const boxPlaceHolder = (
		<div className="flex flex-col">
			<Iconify icon="eva:cloud-upload-fill" size={40} />
			<Typography.Text type="secondary" className="">
				Upload File
			</Typography.Text>
		</div>
	);
	const UploadFileTab = (
		<Space direction="vertical" size="middle" style={{ display: "flex" }}>
			<Card title="Upload Multi File" className="w-full" extra={ThumbnailSwitch}>
				<Upload thumbnail={thumbnail} multiple name="file" action="/api/v1/file/upload" onChange={handleOnChange} />
			</Card>
			<Card title="Upload Single File" extra={ThumbnailSwitch}>
				<Upload thumbnail={thumbnail} maxCount={1} name="file" action="/api/v1/file/upload" onChange={handleOnChange} />
			</Card>
		</Space>
	);
	const UploadAvatarTab = (
		<Card
			title="Upload Avatar"
			styles={{
				body: {
					display: "flex",
					flexDirection: "column",
					justifyContent: "center",
					alignItems: "center",
				},
			}}
		>
			<UploadAvatar name="file" action="/api/v1/file/upload" onChange={handleOnChange} />
		</Card>
	);
	const UploadBoxTab = (
		<Row gutter={[16, 16]}>
			<Col span={24} md={4}>
				<UploadBox name="file" action="/api/v1/file/upload" onChange={handleOnChange} />
			</Col>
			<Col span={24} md={20}>
				<UploadBox placeholder={boxPlaceHolder} name="file" action="/api/v1/file/upload" onChange={handleOnChange} />
			</Col>
		</Row>
	);

	const TABS: TabsProps["items"] = [
		{
			key: "upload--file",
			label: "Upload Single File",
			children: UploadFileTab,
		},
		{ key: "upload-avatar", label: "Upload Avatar", children: UploadAvatarTab },
		{ key: "upload-box", label: "Upload Box", children: UploadBoxTab },
	];

	return <Tabs items={TABS} />;
}
