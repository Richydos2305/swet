export interface IProviderHandler<TRequest = unknown, TResult = unknown> {
  process(request: TRequest): Promise<TResult>;
}
