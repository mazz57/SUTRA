from tests.fixtures.demo_road_network import DEMO_EDGES, DEMO_NODES, demo_request


def post_graph(client, payload):
    return client.post("/graph/build", json=payload)


def test_health_endpoint_still_works(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


class TestDemoScenario:
    def test_demo_graph_expected_counts(self, client):
        response = post_graph(client, demo_request())
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        graph = body["data"]["graph"]
        assert graph["nodeCount"] == len(DEMO_NODES)  # 9 expected nodes
        assert graph["usableEdgeCount"] == 20
        assert graph["excludedEdgeCount"] == 2
        assert graph["connectedComponents"] == 1
        assert graph["componentSizes"] == [9]
        assert graph["isolatedNodeCount"] == 0

    def test_flooded_edges_excluded_with_reason(self, client):
        body = post_graph(client, demo_request()).json()
        excluded = body["data"]["excludedEdges"]
        assert {edge["id"] for edge in excluded} == {"e05", "e06"}
        assert all(edge["reason"] == "EDGE_INACCESSIBLE" for edge in excluded)
        usable_ids = {edge["id"] for edge in body["data"]["usableEdges"]}
        assert not ({"e05", "e06"} & usable_ids)

    def test_usable_edges_preserve_attributes(self, client):
        body = post_graph(client, demo_request()).json()
        usable = {edge["id"]: edge for edge in body["data"]["usableEdges"]}
        assert usable["e01"] == {
            "id": "e01",
            "sourceNodeId": "wh-central",
            "destinationNodeId": "sh-hall",
            "distanceKm": 9.2,
            "travelTimeMin": 15,
        }


class TestDirectionality:
    def test_directed_edge_stays_one_way(self, client):
        # Only one direction between node-a and node-b is supplied.
        payload = {
            "disasterId": "d1",
            "nodes": [
                {"id": "node-a", "name": "A", "latitude": 0.0, "longitude": 0.0},
                {"id": "node-b", "name": "B", "latitude": 0.1, "longitude": 0.1},
            ],
            "edges": [
                {
                    "id": "edge-1",
                    "sourceNodeId": "node-a",
                    "destinationNodeId": "node-b",
                    "distanceKm": 5.0,
                    "travelTimeMin": 10.0,
                }
            ],
        }
        body = post_graph(client, payload).json()
        usable = body["data"]["usableEdges"]
        assert len(usable) == 1
        assert usable[0]["sourceNodeId"] == "node-a"
        assert usable[0]["destinationNodeId"] == "node-b"

    def test_reversed_pair_are_two_distinct_edges(self, client):
        payload = {
            "disasterId": "d1",
            "nodes": [
                {"id": "node-a", "name": "A", "latitude": 0.0, "longitude": 0.0},
                {"id": "node-b", "name": "B", "latitude": 0.1, "longitude": 0.1},
            ],
            "edges": [
                {
                    "id": "edge-1",
                    "sourceNodeId": "node-a",
                    "destinationNodeId": "node-b",
                    "distanceKm": 5.0,
                    "travelTimeMin": 10.0,
                },
                {
                    "id": "edge-2",
                    "sourceNodeId": "node-b",
                    "destinationNodeId": "node-a",
                    "distanceKm": 5.5,
                    "travelTimeMin": 11.0,
                },
            ],
        }
        body = post_graph(client, payload).json()
        assert body["data"]["graph"]["usableEdgeCount"] == 2


class TestInvalidData:
    def test_unknown_edge_endpoint_rejected(self, client):
        payload = demo_request()
        payload["edges"] = payload["edges"] + [
            {
                "id": "e-bad",
                "sourceNodeId": "wh-central",
                "destinationNodeId": "ghost-node",
                "distanceKm": 1.0,
                "travelTimeMin": 1.0,
            }
        ]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "ROAD_EDGE_UNKNOWN_ENDPOINT"

    def test_duplicate_edge_rejected(self, client):
        payload = demo_request()
        payload["edges"] = payload["edges"] + [dict(payload["edges"][0])]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "ROAD_EDGE_DUPLICATE"

    def test_self_loop_rejected(self, client):
        payload = demo_request()
        payload["edges"] = payload["edges"] + [
            {
                "id": "e-loop",
                "sourceNodeId": "wh-central",
                "destinationNodeId": "wh-central",
                "distanceKm": 1.0,
                "travelTimeMin": 1.0,
            }
        ]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "ROAD_EDGE_SELF_LOOP"

    def test_duplicate_node_rejected(self, client):
        payload = demo_request()
        payload["nodes"] = payload["nodes"] + [dict(payload["nodes"][0])]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "ROAD_NODE_DUPLICATE"

    def test_non_positive_distance_rejected(self, client):
        payload = demo_request()
        payload["edges"] = [dict(payload["edges"][0], distanceKm=0)]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"

    def test_missing_field_rejected(self, client):
        payload = demo_request()
        del payload["edges"][0]["distanceKm"]
        response = post_graph(client, payload)
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"


class TestEmptyNetwork:
    def test_empty_road_network_returns_clear_response(self, client):
        payload = {"disasterId": "d1", "nodes": [], "edges": []}
        response = post_graph(client, payload)
        assert response.status_code == 200
        body = response.json()
        assert body["status"] == "ok"
        assert body["data"]["graph"]["nodeCount"] == 0
        assert body["data"]["graph"]["usableEdgeCount"] == 0
        assert body["data"]["message"] == (
            "No road network data exists for this disaster; the graph is empty"
        )

    def test_missing_disaster_id_rejected(self, client):
        response = post_graph(client, {"nodes": [], "edges": []})
        assert response.status_code == 422
        assert response.json()["error"]["code"] == "VALIDATION_ERROR"


class TestDisconnectedNetwork:
    def test_isolated_nodes_and_components_reported(self, client):
        payload = {
            "disasterId": "d1",
            "nodes": [
                {"id": f"node-{i}", "name": f"N{i}", "latitude": 0.0, "longitude": 0.0}
                for i in range(4)
            ],
            "edges": [
                {
                    "id": "edge-1",
                    "sourceNodeId": "node-0",
                    "destinationNodeId": "node-1",
                    "distanceKm": 2.0,
                    "travelTimeMin": 3.0,
                }
            ],
        }
        body = post_graph(client, payload).json()
        graph = body["data"]["graph"]
        assert graph["connectedComponents"] == 3
        assert graph["componentSizes"] == [2, 1, 1]
        assert graph["isolatedNodeCount"] == 2
