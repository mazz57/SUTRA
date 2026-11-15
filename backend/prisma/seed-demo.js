require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// SUTRA demo seed: a fictional coastal flood scenario.
//
// Safety rules:
// - Every record created/updated here carries a "DEMO" prefix in its name.
// - The script only touches records belonging to its own demo disaster
//   (identified by the DEMO_DISASTER_NAME constant) and DEMO-named resources.
// - No deleteMany, no truncation, no resets, no touching of existing data.
// - Inventory is never deducted when creating demand; shortages are left to
//   the optimisation phase.
//
// Idempotency: every lookup is by a stable natural key (resource name,
// warehouseId+resourceId, shelterId+resourceId, sourceNodeId+destinationNodeId,
// or DEMO name scoped to the demo disaster), so repeated runs update the
// canonical values instead of creating duplicates.
// ---------------------------------------------------------------------------

const DEMO_DISASTER_NAME = "DEMO Coastal Flood - Bay of Bengal Surge";

const DEMO_RESOURCES = [
  { name: "DEMO Drinking Water", unit: "bottle", weightPerUnit: 1.0 },
  { name: "DEMO Rice", unit: "kg", weightPerUnit: 1.0 },
  { name: "DEMO Medicine Kit", unit: "kit", weightPerUnit: 2.5 },
  { name: "DEMO Blanket", unit: "piece", weightPerUnit: 1.2 },
  { name: "DEMO Tarpaulin Sheet", unit: "sheet", weightPerUnit: 1.5 },
];

// Fictional coastal region roughly modelled on the Balasore district coast
// (Odisha, India) so coordinates stay geographically consistent.
const DEMO_WAREHOUSES = [
  { name: "DEMO Warehouse - Central Depot", latitude: 21.495, longitude: 86.932 },
  { name: "DEMO Warehouse - North Hub", latitude: 21.601, longitude: 86.897 },
  { name: "DEMO Warehouse - South Depot", latitude: 21.335, longitude: 86.981 },
];

const DEMO_SHELTERS = [
  {
    name: "DEMO Shelter - Coastal High School",
    latitude: 21.548,
    longitude: 86.874,
    population: 620,
    capacity: 800,
    priority: "CRITICAL",
  },
  {
    name: "DEMO Shelter - Community Hall East",
    latitude: 21.421,
    longitude: 86.906,
    population: 450,
    capacity: 500,
    priority: "HIGH",
  },
  {
    name: "DEMO Shelter - Riverside Panchayat Building",
    latitude: 21.376,
    longitude: 86.948,
    population: 300,
    capacity: 350,
    priority: "MEDIUM",
  },
  {
    name: "DEMO Shelter - Inland College Campus",
    latitude: 21.468,
    longitude: 87.015,
    population: 540,
    capacity: 700,
    priority: "HIGH",
  },
];

const DEMO_JUNCTIONS = [
  { name: "DEMO Junction - Rail Crossing", latitude: 21.462, longitude: 86.95 },
  { name: "DEMO Junction - Highway Turnoff", latitude: 21.53, longitude: 86.94 },
];

// availableQuantity[warehouseIndex][resourceIndex]
const DEMO_INVENTORY = [
  //        Water  Rice  MedKit Blanket Tarp
  /* C */ [1400, 1200, 120, 400, 300],
  /* N */ [900, 800, 90, 250, 180],
  /* S */ [700, 600, 70, 200, 150],
];

// requiredQuantity/currentStock[priority by shelter index][resourceIndex]
const DEMO_DEMANDS = [
  //        Water      Rice       MedKit   Blanket    Tarp
  /* SH1 */ [500, 120, 400, 90, 60, 35, 350, 80, 250, 60],
  /* SH2 */ [400, 100, 300, 70, 45, 25, 250, 60, 180, 40],
  /* SH3 */ [350, 80, 250, 55, 40, 20, 200, 45, 160, 35],
  /* SH4 */ [450, 110, 350, 80, 55, 30, 300, 70, 220, 50],
];

const DEMO_ROAD_EDGES = [
  // Central Depot <-> shelters
  { from: "DEMO Warehouse - Central Depot", to: "DEMO Shelter - Community Hall East", distanceKm: 9.2, travelTimeMin: 15 },
  { to: "DEMO Warehouse - Central Depot", from: "DEMO Shelter - Community Hall East", distanceKm: 9.2, travelTimeMin: 16 },
  { from: "DEMO Warehouse - Central Depot", to: "DEMO Shelter - Inland College Campus", distanceKm: 11.4, travelTimeMin: 18 },
  { to: "DEMO Warehouse - Central Depot", from: "DEMO Shelter - Inland College Campus", distanceKm: 11.4, travelTimeMin: 18 },
  // Flooded coastal stretch: Central Depot <-> Riverside (inaccessible)
  { from: "DEMO Warehouse - Central Depot", to: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 8.7, travelTimeMin: 14, isAccessible: false },
  { to: "DEMO Warehouse - Central Depot", from: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 8.7, travelTimeMin: 15, isAccessible: false },
  // North Hub <-> shelters
  { from: "DEMO Warehouse - North Hub", to: "DEMO Shelter - Coastal High School", distanceKm: 7.6, travelTimeMin: 13 },
  { to: "DEMO Warehouse - North Hub", from: "DEMO Shelter - Coastal High School", distanceKm: 7.6, travelTimeMin: 14 },
  { from: "DEMO Warehouse - North Hub", to: "DEMO Junction - Rail Crossing", distanceKm: 16.1, travelTimeMin: 24 },
  { to: "DEMO Warehouse - North Hub", from: "DEMO Junction - Rail Crossing", distanceKm: 16.1, travelTimeMin: 24 },
  // South Depot <-> shelters
  { from: "DEMO Warehouse - South Depot", to: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 6.3, travelTimeMin: 11 },
  { to: "DEMO Warehouse - South Depot", from: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 6.3, travelTimeMin: 12 },
  { from: "DEMO Warehouse - South Depot", to: "DEMO Shelter - Inland College Campus", distanceKm: 14.8, travelTimeMin: 22 },
  { to: "DEMO Warehouse - South Depot", from: "DEMO Shelter - Inland College Campus", distanceKm: 14.8, travelTimeMin: 23 },
  // Junctions linking the north/central network
  { from: "DEMO Junction - Rail Crossing", to: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 10.5, travelTimeMin: 17 },
  { to: "DEMO Junction - Rail Crossing", from: "DEMO Shelter - Riverside Panchayat Building", distanceKm: 10.5, travelTimeMin: 17 },
  { from: "DEMO Junction - Rail Crossing", to: "DEMO Junction - Highway Turnoff", distanceKm: 8.9, travelTimeMin: 14 },
  { to: "DEMO Junction - Rail Crossing", from: "DEMO Junction - Highway Turnoff", distanceKm: 8.9, travelTimeMin: 14 },
  { from: "DEMO Junction - Highway Turnoff", to: "DEMO Shelter - Coastal High School", distanceKm: 5.4, travelTimeMin: 9 },
  { to: "DEMO Junction - Highway Turnoff", from: "DEMO Shelter - Coastal High School", distanceKm: 5.4, travelTimeMin: 9 },
  { from: "DEMO Junction - Highway Turnoff", to: "DEMO Warehouse - Central Depot", distanceKm: 4.6, travelTimeMin: 8 },
  { to: "DEMO Junction - Highway Turnoff", from: "DEMO Warehouse - Central Depot", distanceKm: 4.6, travelTimeMin: 8 },
];

async function findOrCreateDisaster() {
  let disaster = await prisma.disaster.findFirst({
    where: { name: DEMO_DISASTER_NAME, disasterType: "FLOOD" },
  });

  const data = {
    name: DEMO_DISASTER_NAME,
    disasterType: "FLOOD",
    description:
      "Demo scenario: cyclone-driven coastal storm surge flooding a fictional " +
      "Balasore-like district. Safe, repeatable seed data for SUTRA demos.",
    location: "Demo Coast, Balasore District (fictional)",
    status: "ACTIVE",
  };

  if (!disaster) {
    disaster = await prisma.disaster.create({ data });
    console.log(`Created disaster: ${disaster.name}`);
  } else {
    disaster = await prisma.disaster.update({ where: { id: disaster.id }, data });
    console.log(`Reused disaster: ${disaster.name}`);
  }
  return disaster;
}

async function upsertResource(resource) {
  const saved = await prisma.resource.upsert({
    where: { name: resource.name },
    update: { unit: resource.unit, weightPerUnit: resource.weightPerUnit, isActive: true },
    create: resource,
  });
  return saved;
}

async function upsertScopedByName(model, disasterId, name, data) {
  // Shelter/Warehouse/RoadNode names are not unique in the schema, so look up
  // within the demo disaster scope. The DEMO prefix keeps this safe even if a
  // user created same-named records under another disaster.
  const existing = await prisma[model].findFirst({
    where: { disasterId, name },
  });
  if (existing) {
    return prisma[model].update({ where: { id: existing.id }, data });
  }
  return prisma[model].create({ data: { ...data, disasterId, name } });
}

async function main() {
  console.log("Seeding SUTRA demo scenario...");

  const disaster = await findOrCreateDisaster();

  // 1. Resources (unique names, globally safe upserts).
  const resources = {};
  for (const resource of DEMO_RESOURCES) {
    resources[resource.name] = await upsertResource(resource);
  }
  const [water, rice, medKit, blanket, tarp] = DEMO_RESOURCES.map((r) => resources[r.name]);

  // 2. Warehouses.
  const warehouses = {};
  for (const warehouse of DEMO_WAREHOUSES) {
    warehouses[warehouse.name] = await upsertScopedByName(
      "warehouse",
      disaster.id,
      warehouse.name,
      { latitude: warehouse.latitude, longitude: warehouse.longitude, isActive: true },
    );
  }
  const [central, north, south] = DEMO_WAREHOUSES.map((w) => warehouses[w.name]);

  // 3. Shelters.
  const shelters = {};
  for (const shelter of DEMO_SHELTERS) {
    shelters[shelter.name] = await upsertScopedByName(
      "shelter",
      disaster.id,
      shelter.name,
      {
        latitude: shelter.latitude,
        longitude: shelter.longitude,
        population: shelter.population,
        capacity: shelter.capacity,
        priority: shelter.priority,
        isActive: true,
      },
    );
  }
  const [coastal, hall, riverside, campus] = DEMO_SHELTERS.map((s) => shelters[s.name]);

  // 4. Inventory (unique warehouseId+resourceId, safe upserts). Inventory is
  //    never deducted here; quantities are set to canonical values only.
  const warehouseResourceQty = [
    [central, water, rice, medKit, blanket, tarp],
    [north, water, rice, medKit, blanket, tarp],
    [south, water, rice, medKit, blanket, tarp],
  ];
  let inventoryCount = 0;
  for (let w = 0; w < warehouseResourceQty.length; w += 1) {
    const [warehouse, ...resourcesForWarehouse] = warehouseResourceQty[w];
    for (let r = 0; r < resourcesForWarehouse.length; r += 1) {
      const availableQuantity = DEMO_INVENTORY[w][r];
      await prisma.inventory.upsert({
        where: {
          warehouseId_resourceId: {
            warehouseId: warehouse.id,
            resourceId: resourcesForWarehouse[r].id,
          },
        },
        update: { availableQuantity },
        create: {
          warehouseId: warehouse.id,
          resourceId: resourcesForWarehouse[r].id,
          availableQuantity,
        },
      });
      inventoryCount += 1;
    }
  }

  // 5. Demands (unique shelterId+resourceId, safe upserts). Demand is recorded
  //    independently of stock; intended shortages: DEMO Blanket and
  //    DEMO Tarpaulin Sheet.
  const shelterResourceDemand = [
    [coastal, water, rice, medKit, blanket, tarp],
    [hall, water, rice, medKit, blanket, tarp],
    [riverside, water, rice, medKit, blanket, tarp],
    [campus, water, rice, medKit, blanket, tarp],
  ];
  let demandCount = 0;
  for (let s = 0; s < shelterResourceDemand.length; s += 1) {
    const [shelter, ...resourcesForShelter] = shelterResourceDemand[s];
    for (let r = 0; r < resourcesForShelter.length; r += 1) {
      const requiredQuantity = DEMO_DEMANDS[s][r * 2];
      const currentStock = DEMO_DEMANDS[s][r * 2 + 1];
      await prisma.demand.upsert({
        where: {
          shelterId_resourceId: {
            shelterId: shelter.id,
            resourceId: resourcesForShelter[r].id,
          },
        },
        update: { requiredQuantity, currentStock, priority: shelter.priority },
        create: {
          shelterId: shelter.id,
          resourceId: resourcesForShelter[r].id,
          requiredQuantity,
          currentStock,
          priority: shelter.priority,
        },
      });
      demandCount += 1;
    }
  }

  // 6. Road network: nodes then edges (unique sourceNodeId+destinationNodeId).
  const nodes = {};
  for (const node of [...DEMO_WAREHOUSES, ...DEMO_SHELTERS, ...DEMO_JUNCTIONS]) {
    nodes[node.name] = await upsertScopedByName("roadNode", disaster.id, node.name, {
      latitude: node.latitude,
      longitude: node.longitude,
    });
  }

  let edgeCount = 0;
  for (const edge of DEMO_ROAD_EDGES) {
    const source = nodes[edge.from];
    const destination = nodes[edge.to];
    await prisma.roadEdge.upsert({
      where: {
        sourceNodeId_destinationNodeId: {
          sourceNodeId: source.id,
          destinationNodeId: destination.id,
        },
      },
      update: {
        distanceKm: edge.distanceKm,
        travelTimeMin: edge.travelTimeMin,
        isAccessible: edge.isAccessible !== false,
      },
      create: {
        disasterId: disaster.id,
        sourceNodeId: source.id,
        destinationNodeId: destination.id,
        distanceKm: edge.distanceKm,
        travelTimeMin: edge.travelTimeMin,
        isAccessible: edge.isAccessible !== false,
      },
    });
    edgeCount += 1;
  }

  // 7. Report intended shortages (demand vs inventory, no deduction applied).
  const shortageReport = [];
  for (const resource of [water, rice, medKit, blanket, tarp]) {
    const inventoryTotal = await prisma.inventory.aggregate({
      where: { resourceId: resource.id },
      _sum: { availableQuantity: true },
    });
    const demandTotal = await prisma.demand.aggregate({
      where: { resourceId: resource.id },
      _sum: { requiredQuantity: true },
    });
    const available = inventoryTotal._sum.availableQuantity ?? 0;
    const required = demandTotal._sum.requiredQuantity ?? 0;
    if (required > available) {
      shortageReport.push(
        `${resource.name}: demand ${required} > inventory ${available} (short ${required - available})`,
      );
    }
  }

  console.log("Demo seed complete:");
  console.log(`  Disaster:           ${disaster.name} (${disaster.id})`);
  console.log(`  Warehouses:         ${DEMO_WAREHOUSES.length}`);
  console.log(`  Shelters:           ${DEMO_SHELTERS.length}`);
  console.log(`  Resources:          ${DEMO_RESOURCES.length}`);
  console.log(`  Inventory records:  ${inventoryCount}`);
  console.log(`  Demand records:     ${demandCount}`);
  console.log(`  Road nodes:         ${Object.keys(nodes).length}`);
  console.log(`  Road edges:         ${edgeCount} (2 flooded, inaccessible)`);
  console.log("  Intended shortages:");
  for (const line of shortageReport) console.log(`    - ${line}`);
}

main()
  .catch((error) => {
    console.error("Demo seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
