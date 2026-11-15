from fastapi import APIRouter

from app.schemas.road_graph import GraphBuildRequest
from app.services import road_graph_service

router = APIRouter()


@router.post("/graph/build")
def build_graph(payload: GraphBuildRequest) -> dict:
    return road_graph_service.build_road_graph(payload)
