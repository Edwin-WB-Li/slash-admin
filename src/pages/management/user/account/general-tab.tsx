import { faker } from "@faker-js/faker";
import { Button, Col, Form, Input, Row, Space, Switch } from "antd";

import Card from "@/components/card";
import { UploadAvatar } from "@/components/upload";
import { useUserInfo } from "@/store/userStore";
import { toast } from "sonner";

type FieldType = {
	name?: string;
	email?: string;
	mobile?: string;
	address?: string;
	city?: string;
	code?: string;
	nickName?: string;
	about: string;
};
export default function GeneralTab() {
	const { avatar, nickName, email, mobile } = useUserInfo();
	const initFormValues = {
		nickName,
		email,
		mobile,
		address: faker.location.county(),
		city: faker.location.city(),
		code: faker.location.zipCode(),
		about: faker.lorem.paragraphs(),
	};
	const handleClick = () => {
		toast.success("Update success!");
	};
	return (
		<Row gutter={[16, 16]}>
			<Col span={24} lg={8}>
				<Card className="flex-col !px-6 !pb-10 !pt-20">
					<UploadAvatar defaultAvatar={avatar} />

					<Space className="py-6">
						<div>Public Profile</div>
						<Switch size="small" />
					</Space>

					<Button type="primary" danger>
						Delete User
					</Button>
				</Card>
			</Col>
			<Col span={24} lg={16}>
				<Card>
					<Form layout="vertical" initialValues={initFormValues} labelCol={{ span: 8 }} className="w-full">
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item<FieldType> label="Username" name="nickName">
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<FieldType> label="Email" name="email">
									<Input />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item<FieldType> label="Mobile" name="mobile">
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<FieldType> label="Address" name="address">
									<Input />
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item<FieldType> label="City" name="city">
									<Input />
								</Form.Item>
							</Col>
							<Col span={12}>
								<Form.Item<FieldType> label="Code" name="code">
									<Input />
								</Form.Item>
							</Col>
						</Row>

						<Form.Item<FieldType> label="About" name="about">
							<Input.TextArea />
						</Form.Item>

						<div className="flex w-full justify-end">
							<Button type="primary" onClick={handleClick}>
								Save Changes
							</Button>
						</div>
					</Form>
				</Card>
			</Col>
		</Row>
	);
}
