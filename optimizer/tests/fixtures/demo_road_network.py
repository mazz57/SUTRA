# DEMO Coastal Flood scenario road network, mirroring the records created by
# backend/prisma/seed-demo.js (9 nodes, 22 directed edges, 2 flooded edges).
DISASTER_ID = "demo-disaster-0000-0000-0000-000000000000"

DEMO_NODES = [
    {"id": "wh-central", "name": "DEMO Warehouse - Central Depot", "latitude": 21.495, "longitude": 86.932},
    {"id": "wh-north", "name": "DEMO Warehouse - North Hub", "latitude": 21.601, "longitude": 86.897},
    {"id": "wh-south", "name": "DEMO Warehouse - South Depot", "latitude": 21.335, "longitude": 86.981},
    {"id": "sh-coastal", "name": "DEMO Shelter - Coastal High School", "latitude": 21.548, "longitude": 86.874},
    {"id": "sh-hall", "name": "DEMO Shelter - Community Hall East", "latitude": 21.421, "longitude": 86.906},
    {"id": "sh-riverside", "name": "DEMO Shelter - Riverside Panchayat Building", "latitude": 21.376, "longitude": 86.948},
    {"id": "sh-campus", "name": "DEMO Shelter - Inland College Campus", "latitude": 21.468, "longitude": 87.015},
    {"id": "jn-rail", "name": "DEMO Junction - Rail Crossing", "latitude": 21.462, "longitude": 86.95},
    {"id": "jn-highway", "name": "DEMO Junction - Highway Turnoff", "latitude": 21.53, "longitude": 86.94},
]

DEMO_EDGES = [
    {"id": "e01", "sourceNodeId": "wh-central", "destinationNodeId": "sh-hall", "distanceKm": 9.2, "travelTimeMin": 15, "isAccessible": True},
    {"id": "e02", "sourceNodeId": "sh-hall", "destinationNodeId": "wh-central", "distanceKm": 9.2, "travelTimeMin": 16, "isAccessible": True},
    {"id": "e03", "sourceNodeId": "wh-central", "destinationNodeId": "sh-campus", "distanceKm": 11.4, "travelTimeMin": 18, "isAccessible": True},
    {"id": "e04", "sourceNodeId": "sh-campus", "destinationNodeId": "wh-central", "distanceKm": 11.4, "travelTimeMin": 18, "isAccessible": True},
    {"id": "e05", "sourceNodeId": "wh-central", "destinationNodeId": "sh-riverside", "distanceKm": 8.7, "travelTimeMin": 14, "isAccessible": False},
    {"id": "e06", "sourceNodeId": "sh-riverside", "destinationNodeId": "wh-central", "distanceKm": 8.7, "travelTimeMin": 15, "isAccessible": False},
    {"id": "e07", "sourceNodeId": "wh-north", "destinationNodeId": "sh-coastal", "distanceKm": 7.6, "travelTimeMin": 13, "isAccessible": True},
    {"id": "e08", "sourceNodeId": "sh-coastal", "destinationNodeId": "wh-north", "distanceKm": 7.6, "travelTimeMin": 14, "isAccessible": True},
    {"id": "e09", "sourceNodeId": "wh-north", "destinationNodeId": "jn-rail", "distanceKm": 16.1, "travelTimeMin": 24, "isAccessible": True},
    {"id": "e10", "sourceNodeId": "jn-rail", "destinationNodeId": "wh-north", "distanceKm": 16.1, "travelTimeMin": 24, "isAccessible": True},
    {"id": "e11", "sourceNodeId": "wh-south", "destinationNodeId": "sh-riverside", "distanceKm": 6.3, "travelTimeMin": 11, "isAccessible": True},
    {"id": "e12", "sourceNodeId": "sh-riverside", "destinationNodeId": "wh-south", "distanceKm": 6.3, "travelTimeMin": 12, "isAccessible": True},
    {"id": "e13", "sourceNodeId": "wh-south", "destinationNodeId": "sh-campus", "distanceKm": 14.8, "travelTimeMin": 22, "isAccessible": True},
    {"id": "e14", "sourceNodeId": "sh-campus", "destinationNodeId": "wh-south", "distanceKm": 14.8, "travelTimeMin": 23, "isAccessible": True},
    {"id": "e15", "sourceNodeId": "jn-rail", "destinationNodeId": "sh-riverside", "distanceKm": 10.5, "travelTimeMin": 17, "isAccessible": True},
    {"id": "e16", "sourceNodeId": "sh-riverside", "destinationNodeId": "jn-rail", "distanceKm": 10.5, "travelTimeMin": 17, "isAccessible": True},
    {"id": "e17", "sourceNodeId": "jn-rail", "destinationNodeId": "jn-highway", "distanceKm": 8.9, "travelTimeMin": 14, "isAccessible": True},
    {"id": "e18", "sourceNodeId": "jn-highway", "destinationNodeId": "jn-rail", "distanceKm": 8.9, "travelTimeMin": 14, "isAccessible": True},
    {"id": "e19", "sourceNodeId": "jn-highway", "destinationNodeId": "sh-coastal", "distanceKm": 5.4, "travelTimeMin": 9, "isAccessible": True},
    {"id": "e20", "sourceNodeId": "sh-coastal", "destinationNodeId": "jn-highway", "distanceKm": 5.4, "travelTimeMin": 9, "isAccessible": True},
    {"id": "e21", "sourceNodeId": "jn-highway", "destinationNodeId": "wh-central", "distanceKm": 4.6, "travelTimeMin": 8, "isAccessible": True},
    {"id": "e22", "sourceNodeId": "wh-central", "destinationNodeId": "jn-highway", "distanceKm": 4.6, "travelTimeMin": 8, "isAccessible": True},
]


def demo_request() -> dict:
    return {
        "disasterId": DISASTER_ID,
        "nodes": DEMO_NODES,
        "edges": DEMO_EDGES,
    }
