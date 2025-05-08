import type { UploadType } from "@/api/types";

import http from "../apiClient";

export enum FileApi {
	Upload = "/file/upload",
	MultipleUpload = "/file/multiple",
}

const upload = (data: any) => http.post<UploadType>({ url: FileApi.Upload, data });
const multipleUpload = (data: any) => http.post<UploadType>({ url: FileApi.MultipleUpload, data });

export default {
	upload,
	multipleUpload,
};
