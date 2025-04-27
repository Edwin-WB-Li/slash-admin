import type { WeathersResponseType } from "@/api/types";

import http from "../apiClient";

export enum WeathersApi {
	weathers = "/weathers/getWeathersByIp",
}

const getWeathers = () => http.get<WeathersResponseType[]>({ url: WeathersApi.weathers });

export default {
	getWeathers,
};
