// src/utils/errorUtils.js

export function extractApiErrorMessage(err, fallback = "Something went wrong.") {
  if (!err) return fallback;

  // Axios-style error with response
  const res = err.response;
  if (res && res.data) {
    const data = res.data;

    // Our ApiError structure: { status, error, message, details }
    if (typeof data === "object") {
      if (data.message) {
        // if details exists and is a list, you could append it
        if (Array.isArray(data.details) && data.details.length > 0) {
          return `${data.message}: ${data.details[0]}`;
        }
        return data.message;
      }

      // Fallback to any string like error/err/message
      if (data.error) return data.error;
    }

    if (typeof data === "string") {
      return data;
    }
  }

  // Some other error (network, timeout, etc.)
  if (err.message) return err.message;

  return fallback;
}
