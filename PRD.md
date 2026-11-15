
# SUTRA - Product Requirements Document

## 1. Project
Smart Unified Transport and Relief Allocation (SUTRA).

## 2. Problem
During disasters, relief resources may be distributed inefficiently because of limited inventory, changing demand and blocked roads.

## 3. Objective
Build a decision-support system that recommends resource allocations and feasible routes from warehouses to relief shelters.

## 4. Users
- Administrator: manages disaster scenarios, shelters, warehouses and inventory.
- Relief Coordinator: generates, reviews and approves allocation plans.

## 5. Core Modules
1. Disaster Management
2. Shelter and Demand Management
3. Warehouse and Inventory Management
4. Resource Allocation Optimisation
5. Geographic Routing and Simulation
6. Analytics and Allocation History

## 6. Functional Requirements
- Create and manage disaster scenarios.
- Register shelters and their resource demands.
- Register warehouses and available inventory.
- Maintain a road network with distance and accessibility.
- Calculate shortest feasible routes.
- Generate resource allocation plans.
- Show fulfilled and unmet demand.
- Compare allocation algorithms.
- Simulate road closures and demand changes.
- Reoptimise after scenario changes.
- Preserve previous allocation runs.

## 7. Algorithms
- Nearest-first greedy allocation.
- Proportional allocation.
- OR-Tools CP-SAT optimisation.
- NetworkX shortest path using Dijkstra.

## 8. Constraints
- No negative allocations.
- Warehouse stock cannot be exceeded.
- Shelter demand cannot be exceeded.
- Blocked roads cannot be used.
- Resource categories cannot be mixed.
- Unmet demand must be visible.
- Previous plans must remain unchanged.

## 9. Scope Restrictions
- No machine-learning flood prediction.
- No chatbot or generative AI features.
- No real government integration.
- No live GPS tracking.
- No real emergency dispatch.
- No paid external APIs.
- Use synthetic demonstration data.

## 10. Expected Outcome
A functional academic prototype that demonstrates allocation optimisation, route feasibility, disruption simulation and algorithm comparison.
