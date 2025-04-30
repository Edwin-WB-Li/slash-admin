import { useQuery } from "@tanstack/react-query";
import { Card, Descriptions, Skeleton, Space, Tag } from "antd";

import { dependenciesService } from "@/api/services";

export default function About() {
	const { data, isPending } = useQuery({
		queryKey: ["devicesInformationData"],
		queryFn: async () => {
			const res = await dependenciesService.getDevicesInformation();
			return res ?? {};
		},
		staleTime: 1000 * 60 * 10, // 10分钟内不重新请求
		refetchOnWindowFocus: false, // 窗口聚焦时不自动请求
	});
	return (
		<Space direction="vertical" size="middle" style={{ display: "flex" }}>
			<Card title="前端 React 项目所需的生产环境依赖版本信息">
				<Skeleton loading={!__APP_DEPS__?.dependencies} active>
					<Descriptions
						bordered
						items={[
							...Object.entries(__APP_DEPS__?.dependencies || {}).map(([name, version], index) => ({
								key: `prod_${index}`,
								label: <Tag color="geekblue">{name}</Tag>,
								children: <Tag color="green">{version}</Tag>,
								span: 1,
								labelStyle: { width: 250 },
							})),
						]}
					/>
				</Skeleton>
			</Card>
			<Card title="前端 React 项目所需的开发环境依赖版本信息">
				<Skeleton loading={!__APP_DEPS__?.devDependencies} active>
					<Descriptions
						bordered
						items={[
							...Object.entries(__APP_DEPS__?.devDependencies || {}).map(([name, version], index) => ({
								key: `prod_${index}`,
								label: <Tag color="blue">{name}</Tag>,
								children: <Tag color="cyan">{version}</Tag>,
								span: 1,
								labelStyle: { width: 250 },
							})),
						]}
					/>
				</Skeleton>
			</Card>
			<Card title="后端 NestJS 项目所需的生产环境依赖版本信息">
				<Skeleton loading={isPending} active>
					<Descriptions
						bordered
						items={[
							...Object.entries(data?.dependencies || {}).map(([name, version], index) => ({
								key: `prod_${index}`,
								label: <Tag color="geekblue">{name}</Tag>,
								children: <Tag color="green">{version}</Tag>,
								span: 1,
								labelStyle: { width: 250 },
							})),
						]}
					/>
				</Skeleton>
			</Card>
			<Card title="后端 NestJS 所需的开发环境依赖版本信息">
				<Skeleton loading={isPending} active>
					<Descriptions
						bordered
						items={[
							...Object.entries(data?.devDependencies || {}).map(([name, version], index) => ({
								key: `prod_${index}`,
								label: <Tag color="blue">{name}</Tag>,
								children: <Tag color="cyan">{version}</Tag>,
								span: 1,
								labelStyle: { width: 250 },
							})),
						]}
					/>
				</Skeleton>
			</Card>
		</Space>
	);
}
