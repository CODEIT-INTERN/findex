import type {
  CreateIndexInfoRequest,
  IndexInfoListParams,
  IndexInfoResponse,
  UpdateIndexInfoRequest,
} from "@/model/indexInfo";
import type { CursorPageResponse } from "@/model/pagination";
import apiClient from "./client";

// 지수 정보 목록 조회
export const getIndexInfoList = (params?: IndexInfoListParams) => {
  return apiClient.get<CursorPageResponse<IndexInfoResponse>>(
    "/index-infos",
    params,
  );
};

// 지수 정보 상세 조회
export const getIndexInfo = (id: number) => {
  return apiClient.get<IndexInfoResponse>(`/index-infos/${id}`);
};

// 지수 정보 등록
export const createIndexInfo = (data: CreateIndexInfoRequest) => {
  return apiClient.post<IndexInfoResponse>("/index-infos", data);
};

// 지수 정보 수정
export const updateIndexInfo = (id: number, data: UpdateIndexInfoRequest) => {
  return apiClient.patch<IndexInfoResponse>(`/index-infos/${id}`, data);
};
