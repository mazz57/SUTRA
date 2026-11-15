from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError


class AppError(Exception):
    # Domain-level error carrying a deterministic reason code, mirroring the
    # Express error convention: {"status": "error", "error": {code, message}}.
    def __init__(self, status_code: int, code: str, message: str):
        self.status_code = status_code
        self.code = code
        self.message = message
        super().__init__(message)


def _error_body(code: str, message: str) -> dict:
    return {"status": "error", "error": {"code": code, "message": message}}


async def app_error_handler(request: Request, exc: AppError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_body(exc.code, exc.message),
    )


async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content=_error_body("VALIDATION_ERROR", "Request payload failed validation"),
    )


async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    # Full details stay on the server; only a safe message is returned.
    return JSONResponse(
        status_code=500,
        content=_error_body("INTERNAL_ERROR", "Internal server error"),
    )
