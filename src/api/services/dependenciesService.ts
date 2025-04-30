type PackageDependencies = {
	[packageName: string]: string; // 键为包名，值为版本号字符串
};

// 完整配置类型
type DependenciesConfig = {
	dependencies: PackageDependencies;
	devDependencies: PackageDependencies;
};

import http from "../apiClient";

export enum DependenciesApi {
	DevicesInformation = "/dependencies/getDevicesInformation",
}

const getDevicesInformation = () => http.get<DependenciesConfig>({ url: DependenciesApi.DevicesInformation });

export default {
	getDevicesInformation,
};
