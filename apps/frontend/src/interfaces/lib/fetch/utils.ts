export type FetchingWrapperRequest<T = unknown> = {
  callback?: () => T | Promise<T>;
  errorMessage?: string;
  isThrowError?: boolean;
  isNotFound?: boolean;
};

export type TFetchingWrapperError = <T>(
  req: FetchingWrapperRequest<T>
) => Promise<T>;
