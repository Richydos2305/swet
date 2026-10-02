import { Logger } from '@nestjs/common';
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  CreateAxiosDefaults,
} from 'axios';

export class TypedHttpClient {
  private readonly instance: AxiosInstance;
  private readonly logger = new Logger(this.constructor.name);

  constructor(config: CreateAxiosDefaults) {
    this.instance = axios.create(config);

    this.instance.interceptors.request.use((request) => {
      this.logger.log(
        `Request [${request.method?.toUpperCase()}] ${this.resolveUrl(request)} : ${JSON.stringify(request.data ?? {})}`,
      );
      return request;
    });

    this.instance.interceptors.response.use(
      (response) => {
        this.logger.log(
          `Response [${response.config.method?.toUpperCase()}] ${this.resolveUrl(response.config)} - status ${response.status} : ${JSON.stringify(this.describeResponseBody(response.data))}`,
        );
        return response;
      },
      (error: AxiosError) => {
        this.logger.error(
          `Response [${error.config?.method?.toUpperCase()}] ${this.resolveUrl(error.config)} - status ${error.response?.status} : ${JSON.stringify(this.describeResponseBody(error.response?.data))}`,
        );
        return Promise.reject(error);
      },
    );
  }

  private resolveUrl(config?: AxiosRequestConfig): string {
    return `${config?.baseURL ?? ''}${config?.url ?? ''}`;
  }

  /** Override to redact or summarize the logged response body */
  protected describeResponseBody(data: unknown): unknown {
    return data ?? {};
  }

  get<TResponse>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.instance.get<TResponse>(url, config);
  }

  post<TRequest, TResponse>(
    url: string,
    data?: TRequest,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<TResponse>> {
    return this.instance.post<TResponse>(url, data, config);
  }
}
