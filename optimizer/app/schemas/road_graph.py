from pydantic import BaseModel, Field


class RoadNodeIn(BaseModel):
    id: str = Field(min_length=1)
    name: str = Field(min_length=1)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)


class RoadEdgeIn(BaseModel):
    id: str = Field(min_length=1)
    sourceNodeId: str = Field(min_length=1)
    destinationNodeId: str = Field(min_length=1)
    distanceKm: float = Field(gt=0)
    travelTimeMin: float = Field(gt=0)
    isAccessible: bool = True


class GraphBuildRequest(BaseModel):
    # Road network data for exactly one disaster, supplied by the Express
    # backend. The optimizer never queries the database itself.
    disasterId: str = Field(min_length=1)
    nodes: list[RoadNodeIn]
    edges: list[RoadEdgeIn] = Field(default_factory=list)
