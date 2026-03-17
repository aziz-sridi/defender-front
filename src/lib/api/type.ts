import { AxiosRequestConfig } from 'axios'
import { NextApiRequest } from 'next'

export type RequestParams = Record<string, unknown> | URLSearchParams

export interface BaseApiRequestConfig extends AxiosRequestConfig {
  req?: NextApiRequest
}

export interface GetRequestConfig extends Omit<BaseApiRequestConfig, 'data'> {
  params?: RequestParams
}

export interface DeleteRequestConfig extends Omit<BaseApiRequestConfig, 'data'> {
  params?: RequestParams
}

export interface PostRequestConfig<D = unknown> extends BaseApiRequestConfig {
  data?: D
}

export interface PutRequestConfig<D = unknown> extends BaseApiRequestConfig {
  data?: D
}

export interface PatchRequestConfig<D = unknown> extends BaseApiRequestConfig {
  data?: D
}
