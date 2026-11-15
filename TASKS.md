
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
- [x] Shelter CRUD (POST /api/disasters/:disasterId/shelters, GET/GET/PATCH/DELETE /api/shelters, Zod validation with lat/lon bounds, pagination, disasterId filter, 404 DISASTER_NOT_FOUND parent check, 409 FK conflict handling; tested against Neon, temp records cleaned up)
- [x] Warehouse CRUD (POST /api/disasters/:disasterId/warehouses, GET/GET/PATCH/DELETE /api/warehouses, Zod validation with lat/lon bounds, pagination, disasterId filter, 404 DISASTER_NOT_FOUND parent check, 409 FK conflict handling; fixed shelter+warehouse FK detection for Neon 23001 RESTRICT violations; tested against Neon, temp records cleaned up)
- [x] Resource management (GET/POST/GET/PATCH/DELETE /api/resources, shared validation factories (common.validation.js) and db-errors helpers, 409 NAME_CONFLICT on P2002 create+update, 409 FK conflict on delete, update schema without default to avoid resetting weightPerUnit; tested against Neon, temp records cleaned up)
- [x] Inventory management (POST /api/warehouses/:warehouseId/inventory, GET/GET/PATCH/DELETE /api/inventory, warehouse+resource existence checks, warehouseId/resourceId filters, 409 INVENTORY_EXISTS on @@unique(warehouseId,resourceId), non-negative quantity validation via shared validation factories and db-errors helpers; tested against Neon, temp records cleaned up)
- [x] Shelter demand management (POST /api/shelters/:shelterId/demands, GET/GET/PATCH/DELETE /api/demands, shelter+resource existence checks, shelterId/resourceId filters, requiredQuantity positive int (zero rejected), currentStock non-negative, 409 DEMAND_EXISTS on @@unique(shelterId,resourceId), demand accepted regardless of available inventory (shortage left to optimisation); tested against Neon, temp records cleaned up)
- [x] Seed demonstration scenario (backend/prisma/seed-demo.js via npm run db:seed:demo: 1 DEMO flood disaster, 3 warehouses, 4 shelters, 5 DEMO-prefixed resources, 15 inventory + 20 demand upserts, 9 road nodes + 22 edges (2 flooded/inaccessible); idempotent — run twice, record counts stable and no duplicates; intended shortages DEMO Blanket 250 and DEMO Tarpaulin Sheet 180; no deleteMany/truncation, non-demo data untouched, schema unchanged)

## Phase 3 - Algorithms
- [x] Road graph (optimizer POST /graph/build: Pydantic-validated payload of one disaster's nodes+edges from Express, NetworkX DiGraph with direction preserved, inaccessible edges excluded with EDGE_INACCESSIBLE reason, invalid data rejected 422 (unknown endpoint/duplicate/self-loop/zero distances), weakly-connected-component stats; pytest suite 15 tests passing; verified live against DEMO seed data — 9 nodes, 20 usable, 2 excluded, 1 component; no DB access in Python)
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
