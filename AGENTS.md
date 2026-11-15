
# SUTRA - Project Instructions

## Project Goal
Build SUTRA (Smart Unified Transport and Relief Allocation), a disaster relief resource allocation and route optimisation decision-support system.

## Technology Stack
- Frontend: React, Vite, Tailwind CSS
- Main Backend: Node.js, Express
- Database: PostgreSQL with Prisma ORM
- Optimisation Service: Python, FastAPI
- Optimisation: Google OR-Tools CP-SAT
- Routing: NetworkX and Dijkstra
- Maps: React Leaflet and OpenStreetMap
- Charts: Recharts

## Architecture Rules
1. Express is the only backend exposed to the frontend.
2. React must never call the Python service directly.
3. Express owns all database operations.
4. Python receives validated optimisation input through internal HTTP APIs.
5. Python returns results; Express validates and persists them.
6. Keep the project as a modular monolith with one separate Python optimisation service.
7. Do not introduce microservices infrastructure, Redis, queues, Kubernetes or paid APIs.

## Engineering Rules
1. Never generate the entire project in one operation.
2. Implement one feature at a time.
3. Inspect existing files before editing them.
4. Never overwrite working code without explaining why.
5. Use reusable controllers, services, routes and validation.
6. Use environment variables for secrets and connection strings.
7. Never hardcode API keys or database passwords.
8. Use proper HTTP status codes and error handling.
9. Add tests for important algorithms and business rules.
10. Do not use fake data in production API responses.
11. Demo seed data must be clearly separated from real application data.
12. Do not claim a feature works unless it has been executed and tested.

## Optimisation Rules
- Allocations must never be negative.
- Dispatch must not exceed warehouse inventory.
- Delivery must not exceed shelter demand.
- Inaccessible road connections must not be used.
- Unmet demand must be returned explicitly.
- Resource categories must be calculated independently.
- Preserve previous allocation runs.
- Never automatically deduct inventory when generating a plan.
- Use deterministic reason codes for allocation explanations.

## Development Rules
- First inspect the repository.
- Before implementation, explain the files to be created or changed.
- Implement only the requested task.
- Run relevant tests after implementation.
- Fix errors before moving to the next task.
- Update TASKS.md after completing a task.
- Do not add features outside PRD.md.
- Prefer simple, understandable code suitable for a third-year B.Tech project.

## Communication
For each task, report:
1. What was implemented.
2. Files created or changed.
3. Commands executed.
4. Tests performed and their results.
5. Known limitations.
6. Exact next task.
