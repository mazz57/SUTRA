from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from app.core import config
from app.core.errors import (
    AppError,
    app_error_handler,
    internal_error_handler,
    validation_error_handler,
)
from app.routes import health
from app.routes import road_graph

app = FastAPI(title=config.settings.app_name, version=config.settings.version)

app.include_router(health.router)
app.include_router(road_graph.router)

app.add_exception_handler(AppError, app_error_handler)
app.add_exception_handler(RequestValidationError, validation_error_handler)
app.add_exception_handler(Exception, internal_error_handler)
