from fastapi import APIRouter

from app.services import health_service

router = APIRouter()


@router.get("/health")
def get_health() -> dict:
    return health_service.get_health_report()
