// Structural shape of the errors returned by our axios client.
// The backend responds with { message: string } on every failure, so we
// prefer that over axios' generic "Request failed with status code xxx".
type ApiErrorLike = {
  message?: string;
  response?: { data?: { message?: string } };
};

export const getApiErrorMessage = (error: unknown, fallback: string): string => {
  const err = error as ApiErrorLike | null | undefined;
  return err?.response?.data?.message || err?.message || fallback;
};
