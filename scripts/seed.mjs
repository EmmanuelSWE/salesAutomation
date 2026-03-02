/**
 * seed.mjs — Full access-log seeder
 * Creates: 4 staff · 14 clients · contacts · opportunities · proposals · activities
 *
 * Usage:
 *   node scripts/seed.mjs
 *   API_URL=http://localhost:5053 node scripts/seed.mjs
 */

const BASE = process.env.API_URL
  || "https://sales-automation-bmdqg9b6a0d3ffem.southafricanorth-01.azurewebsites.net";

const ADMIN_EMAIL    = "Admin23@Demo.123";
const ADMIN_PASSWORD = "12345678";

/* ═══════════════════════════════════════════════════
   ACCESS LOG
═══════════════════════════════════════════════════ */
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";
const RESET  = "\x1b[0m";

let reqCount = 0;

function accessLog(method, path, status, reqBody, resBody) {
  reqCount++;
  const ts   = new Date().toISOString();
  const ok   = status >= 200 && status < 300;
  const col  = ok ? GREEN : RED;
  const m    = method.padEnd(6);
  const p    = path.length > 70 ? path.slice(0, 67) + "..." : path.padEnd(70);
  console.log(`${DIM}[${ts}]${RESET} #${String(reqCount).padStart(3,"0")} ${CYAN}${m}${RESET} ${p} ${col}${BOLD}${status}${RESET}`);
  if (reqBody)  console.log(`${DIM}         REQ  ${JSON.stringify(reqBody)}${RESET}`);
  if (!ok)      console.log(`${RED}         ERR  ${JSON.stringify(resBody)}${RESET}`);
}

/* ═══════════════════════════════════════════════════
   HTTP HELPER
═══════════════════════════════════════════════════ */
let AUTH_TOKEN = "";

async function api(method, path, body) {
  const url     = `${BASE}/api${path}`;
  const headers = { "Content-Type": "application/json" };
  if (AUTH_TOKEN) headers["Authorization"] = `Bearer ${AUTH_TOKEN}`;

  const res  = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = res.status === 204 ? null : await res.json().catch(() => null);
  accessLog(method, path, res.status, body ?? null, data);
  if (!res.ok) throw Object.assign(new Error(`${method} ${path} => ${res.status}`), { status: res.status, data });
  return data;
}

async function tryApi(method, path, body) {
  try { return await api(method, path, body); }
  catch (e) {
    if (e.status === 409 || e.status === 400) {
      console.log(`${YELLOW}         SKIP (${e.status}) — already exists or conflict${RESET}`);
      return null;
    }
    throw e;
  }
}

/* ═══════════════════════════════════════════════════
   SEED DATA
═══════════════════════════════════════════════════ */
const STAFF = [
  { firstName: "James",   lastName: "Walker",   email: "james@gmail.com",    password: "12345678", role: "SalesRep"     },
  { firstName: "Sarah",   lastName: "Johnson",  email: "sarah@demo.com",     password: "12345678", role: "SalesRep"     },
  { firstName: "Michael", lastName: "Dlamini",  email: "michael@demo.com",   password: "12345678", role: "SalesManager" },
  { firstName: "Lisa",    lastName: "Chen",     email: "lisa@demo.com",      password: "12345678", role: "SalesRep"     },
];

const CLIENTS = [
  { name: "TechNova Solutions",    industry: "Technology",      clientType: 2, companySize: "100-500",  website: "https://technova.co.za",      billingAddress: "12 Innovation Drive, Sandton, JHB",           taxNumber: "4120087631" },
  { name: "Premier Trade Co",      industry: "Retail",          clientType: 2, companySize: "50-100",   website: "https://premiertrade.co.za",   billingAddress: "88 Market Street, Cape Town, WC",             taxNumber: "3890654120" },
  { name: "City Infrastructure",   industry: "Construction",    clientType: 1, companySize: "500-1000", website: "https://cityinfra.gov.za",     billingAddress: "1 Civic Plaza, Tshwane, GP",                  taxNumber: "6051200934" },
  { name: "Apex Financial Group",  industry: "Finance",         clientType: 2, companySize: "100-500",  website: "https://apexfinancial.co.za",  billingAddress: "44 Merchant Road, Durban, KZN",               taxNumber: "7234900812" },
  { name: "Greenleaf Agricultural",industry: "Agriculture",     clientType: 2, companySize: "1-50",     website: "https://greenleaf.farm",       billingAddress: "Plot 23, Stellenbosch Rural, WC",             taxNumber: "2810477660" },
  { name: "MetroHealth Systems",   industry: "Healthcare",      clientType: 1, companySize: "500-1000", website: "https://metrohealth.gov.za",   billingAddress: "5 Hospital Boulevard, Johannesburg, GP",      taxNumber: "9003211745" },
  { name: "Pinnacle Advisory",     industry: "Consulting",      clientType: 3, companySize: "50-100",   website: "https://pinnacleadvisory.co.za",billingAddress: "217 Rosebank Mall Office Park, JHB",          taxNumber: "3312087005" },
  { name: "SwiftLogistics SA",     industry: "Logistics",       clientType: 2, companySize: "100-500",  website: "https://swiftlogistics.co.za", billingAddress: "Logistics Hub, Kempton Park, GP",             taxNumber: "5567431028" },
  { name: "SunEnergy Corp",        industry: "Energy",          clientType: 2, companySize: "100-500",  website: "https://sunenergy.co.za",      billingAddress: "Solar Park 9, Northern Cape, NC",             taxNumber: "6123890411" },
  { name: "DataBridge Systems",    industry: "Technology",      clientType: 3, companySize: "1-50",     website: "https://databridge.io",        billingAddress: "Unit 4, Technopark, Stellenbosch, WC",        taxNumber: "7890122336" },
  { name: "Coastal Properties",    industry: "Real Estate",     clientType: 2, companySize: "50-100",   website: "https://coastalprops.co.za",   billingAddress: "Beach Road 101, Port Elizabeth, EC",          taxNumber: "4430099120" },
  { name: "National Retail Group", industry: "Retail",          clientType: 1, companySize: "1000+",    website: "https://nationalretail.co.za", billingAddress: "Head Office: 3 Commerce Square, JHB, GP",     taxNumber: "1100459873" },
  { name: "ProBuild Construction", industry: "Construction",    clientType: 2, companySize: "100-500",  website: "https://probuild.co.za",       billingAddress: "78 Builders Way, East London, EC",            taxNumber: "8877654310" },
  { name: "MediCare Supplies",     industry: "Healthcare",      clientType: 2, companySize: "50-100",   website: "https://medicaresupp.co.za",   billingAddress: "9 Pharmacy Road, Bloemfontein, FS",           taxNumber: "5521349078" },
];

// One contact per client
const CONTACTS = [
  { firstName: "Thabo",    lastName: "Nkosi",     email: "thabo@technova.co.za",        phoneNumber: "+27 11 501 2234", position: "IT Director",           isPrimaryContact: true  },
  { firstName: "Naledi",   lastName: "Mokoena",   email: "naledi@premiertrade.co.za",   phoneNumber: "+27 21 883 7721", position: "Procurement Lead",      isPrimaryContact: true  },
  { firstName: "Sibusiso", lastName: "Zulu",      email: "sibusiso@cityinfra.gov.za",   phoneNumber: "+27 12 334 8890", position: "Projects Director",     isPrimaryContact: true  },
  { firstName: "Priya",    lastName: "Naidoo",    email: "priya@apexfinancial.co.za",   phoneNumber: "+27 31 200 4450", position: "CFO",                   isPrimaryContact: true  },
  { firstName: "Johan",    lastName: "van Wyk",   email: "johan@greenleaf.farm",        phoneNumber: "+27 21 887 3311", position: "Operations Manager",    isPrimaryContact: true  },
  { firstName: "Dr. Ayanda",lastName: "Cele",     email: "ayanda@metrohealth.gov.za",   phoneNumber: "+27 11 999 0001", position: "Supply Chain Head",     isPrimaryContact: true  },
  { firstName: "Karen",    lastName: "Botha",     email: "karen@pinnacleadvisory.co.za",phoneNumber: "+27 11 788 5500", position: "Managing Partner",      isPrimaryContact: true  },
  { firstName: "Mandla",   lastName: "Sithole",   email: "mandla@swiftlogistics.co.za", phoneNumber: "+27 11 972 3340", position: "Fleet Director",        isPrimaryContact: true  },
  { firstName: "Cleo",     lastName: "Jacobs",    email: "cleo@sunenergy.co.za",        phoneNumber: "+27 53 400 7712", position: "Head of Procurement",   isPrimaryContact: true  },
  { firstName: "Ryan",     lastName: "Petersen",  email: "ryan@databridge.io",          phoneNumber: "+27 21 866 0099", position: "CTO",                   isPrimaryContact: true  },
  { firstName: "Monique",  lastName: "Erasmus",   email: "monique@coastalprops.co.za",  phoneNumber: "+27 41 555 2280", position: "Sales Director",        isPrimaryContact: true  },
  { firstName: "Dlamini",  lastName: "Masondo",   email: "dlamini@nationalretail.co.za",phoneNumber: "+27 11 303 6600", position: "Group Buyer",           isPrimaryContact: true  },
  { firstName: "Werner",   lastName: "du Plessis",email: "werner@probuild.co.za",       phoneNumber: "+27 43 726 0088", position: "Contracts Manager",     isPrimaryContact: true  },
  { firstName: "Fatima",   lastName: "Amod",      email: "fatima@medicaresupp.co.za",   phoneNumber: "+27 51 430 1175", position: "Purchasing Officer",    isPrimaryContact: true  },
];

// Opportunities: [title, estimatedValue, currency, probability, stage(num), source(num), description, daysUntilClose]
const OPPORTUNITIES = [
  { title: "Enterprise CRM Rollout",         estimatedValue: 850000,  currency: "ZAR", probability: 70, stage: 3, source: 1, description: "Full CRM implementation for 200 seats",              daysUntilClose:  90 },
  { title: "Retail POS Upgrade",             estimatedValue: 380000,  currency: "ZAR", probability: 55, stage: 2, source: 3, description: "Point-of-sale modernisation across 12 stores",       daysUntilClose: 120 },
  { title: "Infrastructure Management Suite",estimatedValue: 1200000, currency: "ZAR", probability: 60, stage: 3, source: 5, description: "City-wide asset management platform",                daysUntilClose: 180 },
  { title: "Financial Analytics Platform",   estimatedValue: 620000,  currency: "ZAR", probability: 80, stage: 4, source: 2, description: "Real-time reporting dashboards for compliance",     daysUntilClose:  60 },
  { title: "Farm Management System",         estimatedValue: 95000,   currency: "ZAR", probability: 45, stage: 1, source: 3, description: "Digital crop and inventory tracking solution",      daysUntilClose: 150 },
  { title: "Hospital Procurement Portal",    estimatedValue: 740000,  currency: "ZAR", probability: 65, stage: 3, source: 5, description: "Centralised procurement for 3 metro hospitals",    daysUntilClose: 135 },
  { title: "Strategy Advisory Engagement",   estimatedValue: 230000,  currency: "ZAR", probability: 75, stage: 2, source: 4, description: "12-month embedded advisory retainer",               daysUntilClose:  45 },
  { title: "Fleet Tracking & Optimisation",  estimatedValue: 510000,  currency: "ZAR", probability: 50, stage: 2, source: 1, description: "GPS fleet management and route optimisation",       daysUntilClose: 100 },
  { title: "Solar Energy SCADA Platform",    estimatedValue: 990000,  currency: "ZAR", probability: 60, stage: 3, source: 2, description: "SCADA monitoring for 50MW solar installation",     daysUntilClose: 200 },
  { title: "Data Integration Hub",           estimatedValue: 175000,  currency: "ZAR", probability: 85, stage: 4, source: 4, description: "API integration layer for 8 legacy systems",       daysUntilClose:  30 },
  { title: "Property Management Platform",   estimatedValue: 290000,  currency: "ZAR", probability: 60, stage: 2, source: 3, description: "Tenant, lease and maintenance management",          daysUntilClose:  75 },
  { title: "Retail ERP Implementation",      estimatedValue: 1650000, currency: "ZAR", probability: 55, stage: 3, source: 5, description: "National ERP rollout across 80 stores",             daysUntilClose: 270 },
  { title: "Construction Project Suite",     estimatedValue: 430000,  currency: "ZAR", probability: 65, stage: 2, source: 2, description: "Project scheduling and subcontractor management",  daysUntilClose:  90 },
  { title: "Medical Supply Chain System",    estimatedValue: 315000,  currency: "ZAR", probability: 70, stage: 2, source: 3, description: "Stock, ordering and compliance tracking",           daysUntilClose:  80 },
];

// Proposals for clients 0,2,5 (TechNova, City Infrastructure, MetroHealth)
const PROPOSALS = [
  {
    clientIdx: 0,
    title: "TechNova CRM — Full Implementation Proposal",
    description: "Comprehensive CRM deployment including migration, training and 12-month support.",
    currency: "ZAR",
    validUntilDays: 60,
    status: "Approved",     // will be submitted then approved
    lineItems: [
      { productServiceName: "CRM Licence (200 seats × 12 months)", description: "Cloud SaaS licence",            quantity: 200, unitPrice: 2400,  discount: 10, taxRate: 15 },
      { productServiceName: "Implementation & Data Migration",      description: "Project management + migration", quantity: 1,   unitPrice: 95000, discount: 5,  taxRate: 15 },
      { productServiceName: "On-site Training (5 days)",            description: "End-user training programme",   quantity: 5,   unitPrice: 12000, discount: 0,  taxRate: 15 },
      { productServiceName: "12-month Premier Support",             description: "SLA-backed helpdesk support",   quantity: 1,   unitPrice: 48000, discount: 0,  taxRate: 15 },
    ],
  },
  {
    clientIdx: 2,
    title: "City Infrastructure Management Suite — Phase 1",
    description: "Asset registry and maintenance scheduling — Phase 1 delivery.",
    currency: "ZAR",
    validUntilDays: 90,
    status: "Submitted",   // will be submitted, left in Submitted
    lineItems: [
      { productServiceName: "Platform Licence (500 assets)",  description: "Annual platform licence",             quantity: 1, unitPrice: 320000, discount: 5,  taxRate: 15 },
      { productServiceName: "Implementation Services",        description: "Configuration and integration",       quantity: 1, unitPrice: 185000, discount: 0,  taxRate: 15 },
      { productServiceName: "GIS Data Migration",             description: "Existing GIS data porting",          quantity: 1, unitPrice: 55000,  discount: 0,  taxRate: 15 },
      { productServiceName: "Staff Training (3 cohorts)",     description: "Train-the-trainer programme",        quantity: 3, unitPrice: 18000,  discount: 0,  taxRate: 15 },
    ],
  },
  {
    clientIdx: 5,
    title: "MetroHealth Procurement Portal — Draft Proposal",
    description: "Central procurement portal enabling all three metro hospitals to order, receive and comply.",
    currency: "ZAR",
    validUntilDays: 45,
    status: "Draft",       // stays in Draft
    lineItems: [
      { productServiceName: "Portal Licence (3 hospitals)",  description: "Multi-site SaaS licence",             quantity: 3, unitPrice: 85000, discount: 8,  taxRate: 15 },
      { productServiceName: "Workflow Configuration",        description: "Approval chains and catalogues",      quantity: 1, unitPrice: 65000, discount: 0,  taxRate: 15 },
      { productServiceName: "Integration: Hospital ERP",    description: "API connectors × 3 ERP instances",   quantity: 3, unitPrice: 28000, discount: 5,  taxRate: 15 },
    ],
  },
];

// Activity assignments: [clientIdx, type(num), subject, priority(num), daysUntilDue, staffKey, complete, outcome]
// staffKey indexes into the staffIds array resolved at runtime
const ACTIVITY_PLAN = [
  { ci: 0,  type: 1, subject: "Kick-off meeting: TechNova CRM project",            priority: 3, daysUntilDue: -5,  staffKey: 0, complete: true,  outcome: "Signed SOW received. Project kick-off confirmed for 9 March." },
  { ci: 1,  type: 2, subject: "Discovery call: Premier Trade POS requirements",     priority: 2, daysUntilDue: -3,  staffKey: 1, complete: true,  outcome: "12 store counts confirmed. Hardware specs to follow by email." },
  { ci: 2,  type: 5, subject: "Presentation: City Infrastructure platform demo",   priority: 3, daysUntilDue: -1,  staffKey: 2, complete: true,  outcome: "Council approval pending. Final sign-off expected within 7 days." },
  { ci: 3,  type: 3, subject: "Email: Apex Financial compliance scope clarification",priority: 2, daysUntilDue:  7,  staffKey: 0, complete: false, outcome: null },
  { ci: 4,  type: 4, subject: "Task: Prepare Greenleaf farm visit itinerary",       priority: 1, daysUntilDue:  5,  staffKey: 3, complete: true,  outcome: "Itinerary approved. Site visit booked for 14 March." },
  { ci: 5,  type: 2, subject: "Call: MetroHealth procurement requirements review",  priority: 3, daysUntilDue: 10,  staffKey: 1, complete: false, outcome: null },
  { ci: 6,  type: 1, subject: "Meeting: Pinnacle Advisory partnership discussion",  priority: 2, daysUntilDue: -2,  staffKey: 0, complete: true,  outcome: "Agreed on a 12-month retainer structure. Contract review in progress." },
  { ci: 7,  type: 3, subject: "Email: SwiftLogistics fleet data request",           priority: 1, daysUntilDue: 14,  staffKey: 2, complete: false, outcome: null },
  { ci: 8,  type: 4, subject: "Task: SunEnergy SCADA technical spec review",        priority: 2, daysUntilDue:  8,  staffKey: 0, complete: false, outcome: null },
  { ci: 9,  type: 2, subject: "Call: DataBridge integration architecture walkthrough",priority:3, daysUntilDue: -4,  staffKey: 3, complete: true,  outcome: "8 legacy systems confirmed. Integration blueprint document shared." },
  { ci: 10, type: 1, subject: "Meeting: Coastal Properties platform walkthrough",   priority: 2, daysUntilDue: -1,  staffKey: 1, complete: true,  outcome: "Demo well received. Proposal requested within 2 weeks." },
  { ci: 11, type: 5, subject: "Presentation: National Retail ERP executive briefing",priority:4, daysUntilDue: -6,  staffKey: 0, complete: true,  outcome: "Executive committee approved budget allocation. RFP response invited." },
  { ci: 12, type: 4, subject: "Task: ProBuild subcontractor module configuration",  priority: 2, daysUntilDue: -2,  staffKey: 2, complete: true,  outcome: "Module configured and UAT sign-off received from Werner." },
  { ci: 13, type: 3, subject: "Email: MediCare supply chain compliance checklist",  priority: 2, daysUntilDue: 12,  staffKey: 3, complete: false, outcome: null },
];

/* ═══════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════ */
function futureIso(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0] + "T00:00:00Z";
}

function isoTime(days, hour = 9) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0] + `T${String(hour).padStart(2,"0")}:00:00`;
}

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
async function main() {
  console.log(`\n${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}  SALES AUTOMATION — FULL SEED SCRIPT${RESET}`);
  console.log(`${BOLD}${CYAN}  Target: ${BASE}${RESET}`);
  console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}\n`);

  /* ── 1. Admin auth ─────────────────────────────────────── */
  console.log(`${BOLD}▶ STEP 1 — Admin authentication${RESET}`);
  let adminId, tenantId;

  try {
    const login = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    AUTH_TOKEN = login.token;
    adminId    = login.userId;
    tenantId   = login.tenantId;
    console.log(`${GREEN}  ✔ Logged in as existing admin (${ADMIN_EMAIL})${RESET}`);
  } catch (loginErr) {
    if (loginErr.status === 401 || loginErr.status === 400 || loginErr.status === 404) {
      console.log(`${YELLOW}  Account not found — registering new tenant + admin…${RESET}`);
      const reg = await api("POST", "/auth/register", {
        email:      ADMIN_EMAIL,
        password:   ADMIN_PASSWORD,
        firstName:  "Admin",
        lastName:   "User",
        tenantName: "Demo Organisation",
      });
      AUTH_TOKEN = reg.token;
      adminId    = reg.userId;
      tenantId   = reg.tenantId;
      console.log(`${GREEN}  ✔ Registered new tenant "${tenantId}" and admin (${ADMIN_EMAIL})${RESET}`);
    } else {
      throw loginErr;
    }
  }

  /* ── 2. Register staff ─────────────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 2 — Registering staff members${RESET}`);
  const staffIds = [];

  for (const s of STAFF) {
    // Try login first (idempotent re-runs)
    try {
      const existing = await api("POST", "/auth/login", { email: s.email, password: s.password });
      staffIds.push(existing.userId);
      console.log(`${YELLOW}  ↩ ${s.firstName} ${s.lastName} already exists — using existing account${RESET}`);
    } catch {
      const reg = await tryApi("POST", "/auth/register", {
        email:     s.email,
        password:  s.password,
        firstName: s.firstName,
        lastName:  s.lastName,
        tenantId,
        role:      s.role,
      });
      if (reg) {
        staffIds.push(reg.userId);
        console.log(`${GREEN}  ✔ Registered ${s.firstName} ${s.lastName} <${s.email}> as ${s.role}${RESET}`);
      } else {
        // Registration was skipped — try to get id via users list after admin re-auth
        staffIds.push(null);
      }
    }
  }

  // Re-login as admin (staff registration may have switched token)
  const relogin = await api("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  AUTH_TOKEN = relogin.token;

  /* ── 3. Create 14 clients ──────────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 3 — Creating 14 clients${RESET}`);
  const clientIds = [];

  for (const c of CLIENTS) {
    const res = await tryApi("POST", "/clients", c);
    clientIds.push(res?.id ?? null);
    if (res) console.log(`${GREEN}  ✔ Client "${c.name}"${RESET}`);
  }

  /* ── 4. Create contacts ────────────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 4 — Creating contacts${RESET}`);

  for (let i = 0; i < CONTACTS.length; i++) {
    if (!clientIds[i]) { console.log(`${YELLOW}  SKIP contact ${i} — no client id${RESET}`); continue; }
    const payload = { ...CONTACTS[i], clientId: clientIds[i] };
    const res = await tryApi("POST", "/contacts", payload);
    if (res) console.log(`${GREEN}  ✔ Contact ${CONTACTS[i].firstName} ${CONTACTS[i].lastName} → ${CLIENTS[i].name}${RESET}`);
  }

  /* ── 5. Create opportunities ───────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 5 — Creating opportunities${RESET}`);
  const opportunityIds = [];

  for (let i = 0; i < OPPORTUNITIES.length; i++) {
    if (!clientIds[i]) { opportunityIds.push(null); continue; }
    const o   = OPPORTUNITIES[i];
    const res = await tryApi("POST", "/opportunities", {
      title:             o.title,
      clientId:          clientIds[i],
      ownerId:           staffIds[i % staffIds.length] ?? adminId,
      estimatedValue:    o.estimatedValue,
      currency:          o.currency,
      probability:       o.probability,
      stage:             o.stage,
      source:            o.source,
      expectedCloseDate: futureIso(o.daysUntilClose),
      description:       o.description,
    });
    opportunityIds.push(res?.id ?? null);
    if (res) console.log(`${GREEN}  ✔ Opportunity "${o.title}" (stage ${o.stage})${RESET}`);
  }

  /* ── 6. Create proposals ───────────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 6 — Creating proposals${RESET}`);
  const proposalIds = [];

  for (const p of PROPOSALS) {
    const oppId = opportunityIds[p.clientIdx];
    if (!oppId) { console.log(`${YELLOW}  SKIP proposal — no opportunity for client ${p.clientIdx}${RESET}`); proposalIds.push(null); continue; }

    const res = await tryApi("POST", "/proposals", {
      opportunityId: oppId,
      title:         p.title,
      description:   p.description,
      currency:      p.currency,
      validUntil:    futureIso(p.validUntilDays),
      lineItems:     p.lineItems,
    });

    if (!res) { proposalIds.push(null); continue; }
    const pid = res.id;
    proposalIds.push(pid);
    console.log(`${GREEN}  ✔ Proposal "${p.title}" (${pid})${RESET}`);

    // Advance status
    if (p.status === "Submitted" || p.status === "Approved") {
      await tryApi("PUT", `/proposals/${pid}/submit`, null);
      console.log(`${GREEN}    └─ Submitted${RESET}`);
    }
    if (p.status === "Approved") {
      await tryApi("PUT", `/proposals/${pid}/approve`, null);
      console.log(`${GREEN}    └─ Approved${RESET}`);
    }
  }

  /* ── 7. Create activities ──────────────────────────────── */
  console.log(`\n${BOLD}▶ STEP 7 — Creating activities${RESET}`);

  // Per-staff tracking: { name, generated, completed, activityIds[] }
  const perf = STAFF.map((s, i) => ({
    name:        `${s.firstName} ${s.lastName}`,
    role:        s.role,
    email:       s.email,
    generated:   0,
    completed:   0,
    activityIds: [],
    staffId:     staffIds[i],
  }));

  for (const plan of ACTIVITY_PLAN) {
    const clientId = clientIds[plan.ci];
    const oppId    = opportunityIds[plan.ci];
    if (!clientId) { console.log(`${YELLOW}  SKIP activity — no client${RESET}`); continue; }

    const assignedId = staffIds[plan.staffKey] ?? adminId;

    const res = await tryApi("POST", "/activities", {
      type:          plan.type,
      subject:       plan.subject,
      priority:      plan.priority,
      dueDate:       isoTime(plan.daysUntilDue),
      assignedToId:  assignedId,
      relatedToType: oppId ? 2 : 1,
      relatedToId:   oppId ?? clientId,
    });

    if (!res) continue;
    const aid = res.id;
    perf[plan.staffKey].generated++;
    perf[plan.staffKey].activityIds.push(aid);
    console.log(`${GREEN}  ✔ Activity "${plan.subject}" → ${STAFF[plan.staffKey].firstName}${RESET}`);

    if (plan.complete) {
      await tryApi("PUT", `/activities/${aid}/complete`, { outcome: plan.outcome });
      perf[plan.staffKey].completed++;
      console.log(`${GREEN}    └─ Marked Complete${RESET}`);
    }
  }

  /* ── 8. GET summaries (adds to access log) ─────────────── */
  console.log(`\n${BOLD}▶ STEP 8 — Fetching summary views${RESET}`);
  await tryApi("GET", "/clients?pageNumber=1&pageSize=20", null);
  await tryApi("GET", "/opportunities?pageNumber=1&pageSize=20", null);
  await tryApi("GET", "/activities?pageNumber=1&pageSize=20", null);
  await tryApi("GET", "/dashboard/overview", null);
  await tryApi("GET", "/dashboard/sales-performance?topCount=5", null);
  await tryApi("GET", "/dashboard/activities-summary", null);

  /* ── 9. Staff performance report ───────────────────────── */
  console.log(`\n${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}${CYAN}  STAFF PERFORMANCE REPORT${RESET}`);
  console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${DIM}  Activities Generated = assigned to the staff member`);
  console.log(`  Activities Completed  = marked complete by end of seed${RESET}\n`);

  const nameW = 24, roleW = 14, genW = 22, compW = 22;
  const hdr = [
    "Name".padEnd(nameW),
    "Role".padEnd(roleW),
    "Generated".padEnd(genW),
    "Completed".padEnd(compW),
    "Completion %",
  ].join("│ ");

  const sep = "─".repeat(nameW) + "┼─" + "─".repeat(roleW) + "┼─" + "─".repeat(genW) + "┼─" + "─".repeat(compW) + "┼─" + "─".repeat(14);

  console.log(`  ${BOLD}${hdr}${RESET}`);
  console.log(`  ${sep}`);

  for (const p of perf) {
    const pct  = p.generated > 0 ? Math.round((p.completed / p.generated) * 100) : 0;
    const pctC = pct >= 70 ? GREEN : pct >= 40 ? YELLOW : RED;
    const row  = [
      p.name.padEnd(nameW),
      p.role.padEnd(roleW),
      String(p.generated).padEnd(genW),
      String(p.completed).padEnd(compW),
      `${pctC}${pct}%${RESET}`,
    ].join("│ ");
    console.log(`  ${row}`);
  }

  const totGen  = perf.reduce((s, p) => s + p.generated, 0);
  const totComp = perf.reduce((s, p) => s + p.completed, 0);
  const totPct  = totGen > 0 ? Math.round((totComp / totGen) * 100) : 0;

  console.log(`  ${sep}`);
  console.log(`  ${"TOTAL".padEnd(nameW)}│ ${"".padEnd(roleW)}│ ${String(totGen).padEnd(genW)}│ ${String(totComp).padEnd(compW)}│ ${BOLD}${totPct}%${RESET}`);

  console.log(`\n${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}`);
  console.log(`${BOLD}  Seed complete — ${BOLD}${reqCount}${RESET}${BOLD} API requests logged${RESET}`);
  console.log(`  Clients: ${clientIds.filter(Boolean).length}/14   |   Staff: ${staffIds.filter(Boolean).length}/4`);
  console.log(`  Activities: ${totGen} generated, ${totComp} completed`);
  console.log(`${BOLD}${CYAN}════════════════════════════════════════════════════════════${RESET}\n`);
}

main().catch((err) => {
  console.error(`\n${RED}${BOLD}FATAL:${RESET} ${err.message}`);
  if (err.data) console.error(`${RED}Detail:${RESET}`, JSON.stringify(err.data, null, 2));
  process.exit(1);
});
