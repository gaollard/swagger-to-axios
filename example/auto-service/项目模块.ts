import { request } from "@/utils/request";

export interface QueryProjectTagDTO {
  category_id: number;
}

export const queryTags = (params: QueryProjectTagDTO) => {
    return request<{}>({
      url: "/project/queryTags",
      method: "POST",
      data: params
    });
}

export const queryCategorys = (params: {}) => {
    return request<{}>({
      url: "/project/queryCategorys",
      method: "POST",
      data: params
    });
}

export interface RemoveProjectDTO {
  id: number;
}

export const remove = (params: RemoveProjectDTO) => {
    return request<{}>({
      url: "/project/remove",
      method: "POST",
      data: params
    });
}

export interface CreateProjectDTO {
  id: number;
  user_id: number;
  title: string;
  skill: string;
  description: string;
  remark: string;
  reward: number;
  images: string;
  category_id: number;
  task_type: number;
  task_type_name: string;
}

export const create = (params: CreateProjectDTO) => {
    return request<{}>({
      url: "/project/create",
      method: "POST",
      data: params
    });
}

export interface QueryProjectDTO {
  pageSize: number;
  pageIndex: number;
  title: string;
  task_type: string;
  category_id: string;
}

export const queryList = (params: QueryProjectDTO) => {
    return request<{}>({
      url: "/project/queryList",
      method: "POST",
      data: params
    });
}