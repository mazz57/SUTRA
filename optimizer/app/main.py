from fastapi import FastAPI

from app.core import config
from app.core.errors import internal_error_handler
from app.routes import health

app = FastAPI(title=config.settings.app_name, version=config.settings.version)

app.include_router(health.router)

app.add_exception_handler(Exception, internal_error_handler)
