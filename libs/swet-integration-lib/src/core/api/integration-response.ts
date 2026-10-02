export enum IntegrationResponseStatus {
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  COMPLETED_WITH_ERROR = 'COMPLETED_WITH_ERROR',
}

export interface IntegrationResponse<T> {
  provider: string;
  service: string;
  status: IntegrationResponseStatus;
  data?: T;
  message?: string;
}
