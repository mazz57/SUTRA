
# SUTRA Development Tasks

## Phase 1 - Foundation
- [ ] Create repository structure
- [x] Initialize React frontend (Vite + Tailwind + Router, Leaflet/Recharts installed, dashboard placeholder, /api proxy)
- [x] Initialize Express backend (Express 5, CORS, JSON, layered structure)
- [x] Initialize Python FastAPI service (Python 3.11 venv, pinned deps, GET /health)
- [x] Configure PostgreSQL and Prisma (Neon, initial migration applied)
- [x] Add health endpoints (Express GET /api/health with DB check)
- [x] Verify frontend and both backends run (5173 page 200; proxy /api/health -> Express 200; optimizer /health 200)

## Phase 2 - Core Data
- [x] Disaster CRUD (routes -> controller -> service -> Prisma, Zod validation, pagination, status filter, 404/400/409 handling)
- [ ] Shelter CRUD
- [ ] Warehouse CRUD
- [ ] Resource management
- [ ] Inventory management
- [ ] Shelter demand management
- [ ] Seed demonstration scenario

## Phase 3 - Algorithms
- [ ] Road graph
- [ ] Dijkstra routing
- [ ] Nearest-first allocation
- [ ] Proportional allocation
- [ ] CP-SAT optimisation
- [ ] Allocation validation and reason codes

## Phase 4 - Frontend
- [ ] Dashboard
- [ ] Disaster page
- [ ] Shelter page
- [ ] Warehouse page
- [ ] Allocation page
- [ ] Map view
- [ ] Simulation page
- [ ] Analytics and history

## Phase 5 - Testing and Review
- [ ] API tests
- [ ] Optimisation tests
- [ ] Road closure test
- [ ] Reoptimisation test
- [ ] Algorithm comparison
- [ ] Review documentation
