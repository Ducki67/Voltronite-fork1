import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function sendError(
  c: Context,
  errorCode: string,
  errorMessage: string,
  messageVars: any[],
  numericErrorCode: number,
  error: string | undefined,
  statusCode: ContentfulStatusCode
) {
  c.header("X-Epic-Error-Name", errorCode);
  c.header("X-Epic-Error-Code", numericErrorCode.toString());

  return c.json(
    {
      errorCode,
      errorMessage,
      messageVars,
      numericErrorCode,
      originatingService: "any",
      intent: "prod",
      error_description: errorMessage,
      error,
    },
    statusCode
  );
}
