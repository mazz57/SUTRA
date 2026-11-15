from fastapi import Request
from fastapi.responses import JSONResponse


async def internal_error_handler(request: Request, exc: Exception) -> JSONResponse:
    # Full details stay on the server; only a safe message is returned.
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "Internal server error",
            },
        },
    )
