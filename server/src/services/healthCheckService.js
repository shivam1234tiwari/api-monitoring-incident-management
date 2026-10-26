
export const checkAPIHealth = async (url, method = "GET") => {
  const startTime = Date.now();

  try {
    const response = await fetch(url, {
      method,
      signal: AbortSignal.timeout(10000),
    });

    const responseTime = Date.now() - startTime;

    return {
      status: response.ok ? "UP" : "DOWN",
      statusCode: response.status,
      responseTime,
      checkedAt: new Date(),
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;

    return {
      status: "DOWN",
      statusCode: null,
      responseTime,
      error: error.name === "TimeoutError"
        ? "Request timed out"
        : "API request failed",
      checkedAt: new Date(),
    };
  }
};
