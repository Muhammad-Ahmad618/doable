export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelayMs = 1000,
): Promise<T> => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const is503 = error?.status === 503;
      if (!is503 || attempt === maxAttempts) throw error;
      const delay = baseDelayMs * 2 ** (attempt - 1);
      console.warn(
        `Gemini 503 – retrying in ${delay}ms (attempt ${attempt}/${maxAttempts})...`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Unreachable");
};
