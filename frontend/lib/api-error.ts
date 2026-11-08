type ApiErrorLike = {
  message?: string;
  response?: { data?: { message?: string } };
};

export const getApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  const err = error as ApiErrorLike | null | undefined;
  return err?.response?.data?.message || err?.message || fallback;
};
