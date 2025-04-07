import http from "../apiClient";

interface SendVerifyCodeType {
	email: string;
}

interface ValidateVerifyCodeType extends SendVerifyCodeType {
	code: number;
}

export enum EmailApi {
	SendVerifyCode = "/email/sendVerifyCode",
	ValidateVerifyCode = "/email/validateVerifyCode",
}

const sendVerifyCode = (data: SendVerifyCodeType) => http.post<string>({ url: EmailApi.SendVerifyCode, data });
const validateVerifyCode = (data: ValidateVerifyCodeType) =>
	http.post<string>({ url: EmailApi.ValidateVerifyCode, data });

export default {
	sendVerifyCode,
	validateVerifyCode,
};
