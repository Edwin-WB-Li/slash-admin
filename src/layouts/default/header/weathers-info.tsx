import weathersService from "@/api/services/weathersService";
import { EnvironmentOutlined } from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";

export default function WeathersInfo() {
	const { data, isPending } = useQuery({
		queryKey: ["weathersData"],
		queryFn: async () => {
			const res = await weathersService.getWeathers();
			// 保证返回值不是 undefined
			return res[0] ?? [];
		},
		staleTime: 1000 * 60 * 10, // 10分钟内不重新请求
		refetchOnWindowFocus: false, // 窗口聚焦时不自动请求
	});

	return (
		data && (
			<>
				<EnvironmentOutlined className="pl-2" />
				<Spin spinning={isPending} className="h-full">
					<div className="flex justify-center items-center gap-4 h-full pl-1 pr-2">
						<span>{data?.province}</span>
						<span>{data?.city}</span>
						<span>{data?.weather}</span>
						<span>{data?.temperature}°</span>
						<span>{data?.winddirection}风</span>
						<span>{data?.windpower}级</span>
						<span>湿度 {data?.humidity} %</span>
					</div>
				</Spin>
			</>
		)
	);
}
