export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: any;
}

export interface IErrorDetail {
  message: string;
  fieldName?: string;
  context?: Record<string, unknown>;
}

export interface IStructuredErrors {
  statusCode: number;
  error: string;
  apiPath: string;
  timestamp: string;
  details: IErrorDetail[];
}

export interface IApiErrorResponse {
  success: false;
  message: string;
  data: null;
  errors: IStructuredErrors;
}
