import type { UploadProps } from "antd";

import { Typography, Upload } from "antd";
import { useState } from "react";

import { themeVars } from "@/theme/theme.css";
import { fBytes } from "@/utils/format-number";
import { toast } from "sonner";
import { Iconify } from "../icon";
import { StyledUploadAvatar } from "./styles";
import { beforeAvatarUpload, getBlobUrl } from "./utils";

interface Props extends UploadProps {
	defaultAvatar?: string;
	helperText?: React.ReactElement | string;
}
export function UploadAvatar({ helperText, defaultAvatar = "", ...other }: Props) {
	const [imageUrl, setImageUrl] = useState<string>(defaultAvatar);

	const [isHover, setIsHover] = useState(false);
	const handelHover = (hover: boolean) => {
		setIsHover(hover);
	};

	const handleChange: UploadProps["onChange"] = (info) => {
		if (info.file.status === "uploading") {
			return;
		}
		if (info.file.status === "done") {
			// TODO: Get this url from response in real world.
			toast.success(`${info.file.name} file uploaded successfully.`, {
				position: "top-center",
			});
			if (info.file.originFileObj) {
				setImageUrl(getBlobUrl(info.file.originFileObj));
			}
		}

		if (info.file.status === "error") {
			toast.success(`${info.file.name} file uploaded successfully.`, {
				position: "top-center",
			});
		}
	};

	const renderPreview = <img src={imageUrl} alt="" className="absolute rounded-full" />;

	const renderPlaceholder = (
		<div
			style={{
				backgroundColor: !imageUrl || isHover ? themeVars.colors.background.neutral : "transparent",
			}}
			className="absolute z-10 flex h-full w-full flex-col items-center justify-center"
		>
			<Iconify icon="solar:camera-add-bold" size={32} />
			<div className="mt-1 text-xs">Upload Photo</div>
		</div>
	);

	const renderContent = (
		<div
			className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full"
			onMouseEnter={() => handelHover(true)}
			onMouseLeave={() => handelHover(false)}
		>
			{imageUrl ? renderPreview : null}
			{!imageUrl || isHover ? renderPlaceholder : null}
		</div>
	);

	const defaultHelperText = (
		<Typography.Text type="secondary" style={{ fontSize: 12 }}>
			Allowed *.jpeg, *.jpg, *.png, *.gif
			<br /> max size of {fBytes(3145728)}
		</Typography.Text>
	);
	const renderHelpText = <div className="text-center">{helperText || defaultHelperText}</div>;

	return (
		<StyledUploadAvatar>
			<Upload
				name="file"
				showUploadList={false}
				listType="picture-circle"
				className="avatar-uploader !flex items-center justify-center"
				{...other}
				beforeUpload={beforeAvatarUpload}
				onChange={handleChange}
			>
				{renderContent}
			</Upload>
			{renderHelpText}
		</StyledUploadAvatar>
	);
}
