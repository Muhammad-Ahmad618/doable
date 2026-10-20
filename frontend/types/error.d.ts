export interface ApiError {
  message: string;
  response: {
    data: ApiError;
  };
}
