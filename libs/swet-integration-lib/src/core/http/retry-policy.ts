import { AxiosError } from 'axios';

export interface RetryPolicy {
  maxAttempts: number;
  shouldRetry: (error: unknown, attempt: number) => boolean;
}

export function retryOn(
  predicate: (error: unknown) => boolean,
  maxAttempts = 2,
): RetryPolicy {
  return { maxAttempts, shouldRetry: (error) => predicate(error) };
}

export function onHttpStatus(
  ...statuses: number[]
): (error: unknown) => boolean {
  return (error) =>
    error instanceof AxiosError &&
    statuses.includes(error.response?.status ?? 0);
}

export async function withRetry<T>(
  fn: (attempt: number) => Promise<T>,
  policy: RetryPolicy,
): Promise<T> {
  let attempt = 0;
  for (;;) {
    try {
      return await fn(attempt);
    } catch (error) {
      attempt++;
      if (
        attempt >= policy.maxAttempts ||
        !policy.shouldRetry(error, attempt)
      ) {
        throw error;
      }
    }
  }
}
