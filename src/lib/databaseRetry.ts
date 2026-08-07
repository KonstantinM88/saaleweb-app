import "server-only";

type RetryOptions = {
  operation: string;
  maxAttempts?: number;
  baseDelayMs?: number;
};

type ErrorDetails = {
  prismaCode?: string;
  databaseCode?: string;
  message: string;
};

function errorDetails(error: unknown): ErrorDetails {
  if (!error || typeof error !== "object") {
    return { message: "Unknown database error" };
  }

  const candidate = error as {
    code?: unknown;
    message?: unknown;
    meta?: { code?: unknown } | null;
  };

  return {
    prismaCode: typeof candidate.code === "string" ? candidate.code : undefined,
    databaseCode:
      candidate.meta && typeof candidate.meta.code === "string"
        ? candidate.meta.code
        : undefined,
    message:
      typeof candidate.message === "string"
        ? candidate.message
        : "Unknown database error",
  };
}

export function isTransientDatabaseConnectionError(error: unknown): boolean {
  const details = errorDetails(error);
  const transientPrismaCodes = new Set(["P1001", "P1002", "P2024"]);

  return (
    transientPrismaCodes.has(details.prismaCode ?? "") ||
    details.databaseCode === "53300" ||
    /(?:53300|failed to acquire permit|too many database connection attempts|connection pool timeout)/i.test(
      details.message,
    )
  );
}

function wait(delayMs: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}

/**
 * Retries only short-lived database connection pressure. Query/data errors are
 * rethrown immediately so a broken report cannot be mistaken for a healthy one.
 */
export async function withDatabaseConnectionRetry<T>(
  task: () => Promise<T>,
  { operation, maxAttempts = 3, baseDelayMs = 500 }: RetryOptions,
): Promise<T> {
  let attempt = 1;

  while (true) {
    try {
      return await task();
    } catch (error) {
      if (!isTransientDatabaseConnectionError(error) || attempt >= maxAttempts) {
        throw error;
      }

      const details = errorDetails(error);
      const delayMs = baseDelayMs * 2 ** (attempt - 1) + Math.floor(Math.random() * 200);
      console.warn("[database] Temporary connection pressure; retrying operation.", {
        operation,
        attempt,
        maxAttempts,
        delayMs,
        prismaCode: details.prismaCode,
        databaseCode: details.databaseCode,
      });

      await wait(delayMs);
      attempt += 1;
    }
  }
}
