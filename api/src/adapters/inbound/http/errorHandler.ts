import { ConflictError, DomainError, NotFoundError, UnauthorizedError } from "@/domain/errors";
import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "invalid_request",
        message: "The request is invalid.",
        details: err.issues.map((i) => ({path: i.path.join("."), message: i.message})),
      }
    });
    return
  }

  if (err instanceof DomainError) {
    const status = err instanceof UnauthorizedError ? 401 : err instanceof ConflictError ? 409 : err instanceof NotFoundError ? 404 : 400;
    res.status(status).json({error: {code: err.code, message: err.message}});
    return;
  }

  const status = (err as {status?: number}).status;
  if (typeof status === 'number' && status >= 400 && status < 500) {
    res.status(status).json({error: {code: "bad_request", message: "The request could not be processed."}});
    return;
  }

  req.log.error({err}, "unhandled error");
  res.status(500).json({error: {code: 'internal_error', message: "Something went wrong.", requestId: req.id}});
}