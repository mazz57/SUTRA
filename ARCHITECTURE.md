
# SUTRA Architecture

## Request Flow

React Frontend
    |
    v
Express REST API
    |
    +----> PostgreSQL through Prisma
    |
    +----> Python FastAPI Optimisation Service
                  |
                  +---- OR-Tools CP-SAT
                  |
                  +---- NetworkX / Dijkstra

## Responsibilities

### React
Dashboard, forms, allocation results, maps, charts and history.

### Express
Authentication, validation, CRUD, database access, optimisation orchestration, history and audit logs.

### Python
Allocation algorithms, route calculations, feasibility checks and optimisation metrics.

### PostgreSQL
Disasters, shelters, warehouses, resources, inventory, demands, roads, allocation runs and events.

## Internal Optimisation API

POST /internal/optimize

Input:
- Disaster ID
- Warehouses and inventory
- Shelters and demand
- Road network
- Selected algorithm

Output:
- Allocation quantities
- Unmet demand
- Feasible routes
- Algorithm status
- Execution time
- Metrics

Python must not directly access PostgreSQL.
