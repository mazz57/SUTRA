import networkx as nx

from app.core.errors import AppError


def _validate_edges(payload) -> list:
    # Reject invalid or incomplete graph data instead of silently creating
    # invalid connections.
    node_ids = {node.id for node in payload.nodes}
    if len(node_ids) != len(payload.nodes):
        raise AppError(422, "ROAD_NODE_DUPLICATE", "Duplicate node ids in road network")

    seen_edge_keys = set()
    for edge in payload.edges:
        if edge.sourceNodeId == edge.destinationNodeId:
            raise AppError(
                422,
                "ROAD_EDGE_SELF_LOOP",
                f"Road edge {edge.id} connects a node to itself",
            )
        unknown = [
            endpoint
            for endpoint in (edge.sourceNodeId, edge.destinationNodeId)
            if endpoint not in node_ids
        ]
        if unknown:
            raise AppError(
                422,
                "ROAD_EDGE_UNKNOWN_ENDPOINT",
                f"Road edge {edge.id} references nodes not in the network: "
                + ", ".join(unknown),
            )
        key = (edge.sourceNodeId, edge.destinationNodeId)
        if key in seen_edge_keys:
            raise AppError(
                422,
                "ROAD_EDGE_DUPLICATE",
                f"Duplicate road edge from {edge.sourceNodeId} to {edge.destinationNodeId}",
            )
        seen_edge_keys.add(key)

    return node_ids


def build_road_graph(payload) -> dict:
    """Build a routable directed graph from one disaster's road network.

    Edge direction is preserved (DiGraph, no automatic bidirectionality).
    Inaccessible (flooded/blocked) edges are excluded from the routable
    graph but reported with a deterministic reason code.
    """
    _validate_edges(payload)

    graph = nx.DiGraph()
    for node in payload.nodes:
        graph.add_node(
            node.id, name=node.name, latitude=node.latitude, longitude=node.longitude
        )

    usable_edges = []
    excluded_edges = []
    for edge in payload.edges:
        if not edge.isAccessible:
            excluded_edges.append(
                {
                    "id": edge.id,
                    "sourceNodeId": edge.sourceNodeId,
                    "destinationNodeId": edge.destinationNodeId,
                    "reason": "EDGE_INACCESSIBLE",
                }
            )
            continue
        graph.add_edge(
            edge.sourceNodeId,
            edge.destinationNodeId,
            edgeId=edge.id,
            distanceKm=edge.distanceKm,
            travelTimeMin=edge.travelTimeMin,
        )
        usable_edges.append(
            {
                "id": edge.id,
                "sourceNodeId": edge.sourceNodeId,
                "destinationNodeId": edge.destinationNodeId,
                "distanceKm": edge.distanceKm,
                "travelTimeMin": edge.travelTimeMin,
            }
        )

    # Weakly connected components: isolated nodes appear as singleton
    # components, so disconnected networks are visible in the statistics.
    components = sorted(
        (len(component) for component in nx.weakly_connected_components(graph)),
        reverse=True,
    )

    result = {
        "disasterId": payload.disasterId,
        "graph": {
            "nodeCount": graph.number_of_nodes(),
            "usableEdgeCount": len(usable_edges),
            "excludedEdgeCount": len(excluded_edges),
            "connectedComponents": len(components),
            "componentSizes": components,
            "isolatedNodeCount": components.count(1),
        },
        "usableEdges": usable_edges,
        "excludedEdges": excluded_edges,
    }

    if graph.number_of_nodes() == 0:
        result["message"] = (
            "No road network data exists for this disaster; the graph is empty"
        )

    return {"status": "ok", "data": result}
