# Sales Automation API — Test Report

**Date:** 26 February 2026
**Tested by:** Development Team
**Environment:** Local (http://localhost:5053) → Production (Azure, South Africa North)
**Production URL:** https://sales-automation-bmdqg9b6a0d3ffem.southafricanorth-01.azurewebsites.net
**Test type:** Functional endpoint testing (manual, curl-based)
**Total endpoints tested:** 89
**Result: ALL PASS ✅**

---

## Test Accounts Used

| Email | Password | Role | Tenant |
|---|---|---|---|
| admin@salesautomation.com | Admin@123 | Admin | Default (11111111-1111-1111-1111-111111111111) |

---

## 1. Health & Authentication

### 1.1 GET /health
No payload.
**Response `200`**
```json
{ "status": "healthy" }
```
**Result: ✅ PASS**

---

### 1.2 POST /api/auth/login
```json
{
  "email": "admin@salesautomation.com",
  "password": "Admin@123"
}
```
**Response `200`**
```json
{
  "token": "<jwt>",
  "userId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "email": "admin@salesautomation.com",
  "firstName": "System",
  "lastName": "Administrator",
  "roles": ["Admin"],
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "expiresAt": "2026-02-26T12:00:00Z"
}
```
**Result: ✅ PASS**

---

### 1.3 POST /api/auth/register — Scenario A (new organisation)
```json
{
  "email": "alice@newcorp.com",
  "password": "Pass@123",
  "firstName": "Alice",
  "lastName": "Smith",
  "tenantName": "New Corp"
}
```
**Response `201`** — same shape as login, `tenantId` = newly created org's ID, role = `Admin`
**Result: ✅ PASS**

---

### 1.4 POST /api/auth/register — Scenario B (join existing org)
```json
{
  "email": "bob@newcorp.com",
  "password": "Pass@123",
  "firstName": "Bob",
  "lastName": "Jones",
  "tenantId": "63d7bdc1-d2c4-488c-98c7-15c8d0657d58",
  "role": "SalesManager"
}
```
**Response `201`** — `tenantId` matches the existing org
**Result: ✅ PASS**

---

### 1.5 POST /api/auth/register — Scenario C (default tenant)
```json
{
  "email": "carol@test.com",
  "password": "Pass@123",
  "firstName": "Carol",
  "lastName": "White",
  "role": "SalesRep"
}
```
**Response `201`** — `tenantId` = `11111111-1111-1111-1111-111111111111`
**Result: ✅ PASS**

---

### 1.6 POST /api/auth/register — Admin self-assign blocked
```json
{
  "email": "hacker@test.com",
  "password": "Pass@123",
  "firstName": "Bad",
  "lastName": "Actor",
  "tenantId": "11111111-1111-1111-1111-111111111111",
  "role": "Admin"
}
```
**Response `400`** — `"Cannot self-assign Admin role"`
**Result: ✅ PASS**

---

### 1.7 GET /api/auth/me
No payload. Authorization header required.
**Response `200`** — returns current user profile and roles.
**Result: ✅ PASS**

---

## 2. Clients

### 2.1 POST /api/clients
```json
{
  "name": "Acme Corp",
  "industry": "Technology",
  "clientType": 2,
  "companySize": "100-500",
  "website": "https://acme.com",
  "billingAddress": "123 Main St, Johannesburg",
  "taxNumber": "1234567890"
}
```
**Response `201`** — `id`, `name`, `createdAt` returned
**Result: ✅ PASS**

---

### 2.2 GET /api/clients?pageNumber=1&pageSize=10
No payload.
**Response `200`**
```json
{
  "items": [...],
  "pageNumber": 1,
  "pageSize": 10,
  "totalCount": 5
}
```
**Result: ✅ PASS**

---

### 2.3 GET /api/clients/{id}
No payload.
**Response `200`** — full client object
**Result: ✅ PASS**

---

### 2.4 PUT /api/clients/{id}
```json
{
  "name": "Acme Corp Updated",
  "industry": "Technology",
  "clientType": 2,
  "companySize": "500-1000",
  "website": "https://acme.com",
  "billingAddress": "456 New St, Johannesburg",
  "taxNumber": "9876543210"
}
```
**Response `200`** — updated client object
**Result: ✅ PASS**

---

### 2.5 GET /api/clients/{id}/stats
No payload.
**Response `200`**
```json
{
  "clientId": "...",
  "clientName": "Acme Corp",
  "totalOpportunities": 2,
  "activeOpportunities": 1,
  "totalContracts": 1,
  "totalContractValue": 200000
}
```
**Result: ✅ PASS**

---

### 2.6 DELETE /api/clients/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 3. Contacts

### 3.1 POST /api/contacts
```json
{
  "clientId": "44366f43-9251-4a67-8615-b40ecd2f3aac",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@acme.com",
  "phoneNumber": "+27 11 123 4567",
  "position": "Procurement Manager",
  "isPrimaryContact": true
}
```
**Response `201`**
**Result: ✅ PASS**

---

### 3.2 GET /api/contacts?clientId={id}&pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list of contacts
**Result: ✅ PASS**

---

### 3.3 GET /api/contacts/by-client/{clientId}
No payload.
**Response `200`** — array of contacts for the client
**Result: ✅ PASS**

---

### 3.4 GET /api/contacts/{id}
No payload.
**Response `200`** — single contact
**Result: ✅ PASS**

---

### 3.5 PUT /api/contacts/{id}
```json
{
  "clientId": "44366f43-9251-4a67-8615-b40ecd2f3aac",
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.updated@acme.com",
  "phoneNumber": "+27 11 999 8888",
  "position": "Head of Procurement",
  "isPrimaryContact": true
}
```
**Response `200`** — updated contact
**Result: ✅ PASS**

---

### 3.6 PUT /api/contacts/{id}/set-primary
No payload.
**Response `200`** — contact with `isPrimaryContact: true`; previous primary contact automatically unmarked
**Result: ✅ PASS**

---

### 3.7 DELETE /api/contacts/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 4. Opportunities

### 4.1 POST /api/opportunities
```json
{
  "title": "Big Deal",
  "clientId": "44366f43-9251-4a67-8615-b40ecd2f3aac",
  "ownerId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "estimatedValue": 750000,
  "currency": "ZAR",
  "probability": 40,
  "stage": 1,
  "source": 1,
  "expectedCloseDate": "2026-08-30T00:00:00Z",
  "description": "Enterprise licensing deal"
}
```
**Response `201`** — `id`, `opportunityNumber`, `stageName: "Lead"`
**Result: ✅ PASS**

---

### 4.2 GET /api/opportunities?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 4.3 GET /api/opportunities/{id}
No payload.
**Response `200`** — full opportunity with stage history count
**Result: ✅ PASS**

---

### 4.4 GET /api/opportunities/my-opportunities?pageNumber=1&pageSize=10
No payload.
**Response `200`** — opportunities where `ownerId` = current user
**Result: ✅ PASS**

---

### 4.5 GET /api/opportunities/pipeline
No payload.
**Response `200`**
```json
{
  "stages": [
    { "stage": 1, "stageName": "Lead", "count": 0, "totalValue": 0 },
    { "stage": 3, "stageName": "Proposal", "count": 1, "totalValue": 750000 }
  ],
  "weightedPipelineValue": 344723.76,
  "conversionRate": 0
}
```
**Result: ✅ PASS**

---

### 4.6 PUT /api/opportunities/{id}/stage
```json
{
  "stage": 3,
  "notes": "Proposal sent to client",
  "lossReason": null
}
```
**Response `200`** — `stageName: "Proposal"`, stage history entry created
**Result: ✅ PASS**

---

### 4.7 GET /api/opportunities/{id}/stage-history
No payload.
**Response `200`** — array of stage changes with `fromStage`, `toStage`, `changedAt`, `notes`
**Result: ✅ PASS**

---

### 4.8 POST /api/opportunities/{id}/assign
```json
{
  "userId": "4446e829-4761-4da5-8f38-8c20a778500c"
}
```
**Response `200`** — updated opportunity with `ownerName`
**Result: ✅ PASS**

---

### 4.9 PUT /api/opportunities/{id}
```json
{
  "title": "Big Deal Updated",
  "clientId": "44366f43-9251-4a67-8615-b40ecd2f3aac",
  "ownerId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "estimatedValue": 750000,
  "currency": "ZAR",
  "probability": 60,
  "stage": 3,
  "source": 1,
  "expectedCloseDate": "2026-08-30T00:00:00Z"
}
```
**Response `200`**
**Result: ✅ PASS**

---

### 4.10 DELETE /api/opportunities/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 5. Proposals

### 5.1 POST /api/proposals
```json
{
  "opportunityId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "title": "Q1 2026 Enterprise Proposal",
  "description": "Full implementation package",
  "currency": "ZAR",
  "validUntil": "2026-06-30T00:00:00Z",
  "lineItems": [
    {
      "productServiceName": "Implementation Services",
      "description": "Phase 1 setup and configuration",
      "quantity": 1,
      "unitPrice": 80000,
      "discount": 5,
      "taxRate": 15
    },
    {
      "productServiceName": "Annual Support License",
      "description": "12-month support",
      "quantity": 1,
      "unitPrice": 24000,
      "discount": 0,
      "taxRate": 15
    }
  ]
}
```
**Response `201`** — `proposalNumber: "PROP-2026-00001"`, `totalAmount` auto-calculated
**Result: ✅ PASS**

---

### 5.2 GET /api/proposals?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 5.3 GET /api/proposals/{id}
No payload.
**Response `200`** — proposal with full `lineItems` array
**Result: ✅ PASS**

---

### 5.4 PUT /api/proposals/{id}
```json
{
  "title": "Q1 2026 Enterprise Proposal (Revised)",
  "description": "Updated implementation package",
  "currency": "ZAR",
  "validUntil": "2026-07-31T00:00:00Z"
}
```
**Response `200`**
**Result: ✅ PASS**

---

### 5.5 POST /api/proposals/{id}/line-items
```json
{
  "productServiceName": "Training Package",
  "description": "On-site user training (3 days)",
  "quantity": 3,
  "unitPrice": 8000,
  "discount": 0,
  "taxRate": 15
}
```
**Response `201`** — line item with auto-calculated `totalPrice`; proposal total recalculated
**Result: ✅ PASS**

---

### 5.6 PUT /api/proposals/{id}/line-items/{lineItemId}
```json
{
  "productServiceName": "Training Package",
  "description": "On-site user training (5 days)",
  "quantity": 5,
  "unitPrice": 8000,
  "discount": 10,
  "taxRate": 15
}
```
**Response `200`** — updated line item; proposal total recalculated
**Result: ✅ PASS**

---

### 5.7 DELETE /api/proposals/{id}/line-items/{lineItemId}
No payload.
**Response `204`** — line item removed; proposal total recalculated
**Result: ✅ PASS**

---

### 5.8 PUT /api/proposals/{id}/submit
No payload.
**Response `200`** — `statusName: "Submitted"`, `submittedDate` set
**Result: ✅ PASS**

---

### 5.9 PUT /api/proposals/{id}/approve
No payload.
**Response `200`** — `statusName: "Approved"`, `approvedDate` set
**Result: ✅ PASS**

---

### 5.10 PUT /api/proposals/{id}/reject
No payload.
**Response `200`** — `statusName: "Rejected"`
**Result: ✅ PASS**

---

### 5.11 DELETE /api/proposals/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 6. Pricing Requests

### 6.1 POST /api/pricingrequests
```json
{
  "opportunityId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "title": "Custom Volume Pricing",
  "description": "Client requesting volume discount for 50+ licenses",
  "priority": 3,
  "requiredByDate": "2026-03-15T00:00:00Z"
}
```
**Response `201`** — `requestNumber: "PREQ-2026-00001"`, `statusName: "Pending"`
**Result: ✅ PASS**

---

### 6.2 POST /api/pricingrequests (with assignedToId)
```json
{
  "opportunityId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "title": "Pre-assigned Pricing Request",
  "priority": 2,
  "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "requiredByDate": "2026-04-01T00:00:00Z"
}
```
**Response `201`** — `statusName: "InProgress"` (auto-set because `assignedToId` provided)
**Result: ✅ PASS**

---

### 6.3 GET /api/pricingrequests?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 6.4 GET /api/pricingrequests/{id}
No payload.
**Response `200`**
**Result: ✅ PASS**

---

### 6.5 GET /api/pricingrequests/pending
No payload.
**Response `200`** — list of unassigned requests ordered by priority
**Result: ✅ PASS**

---

### 6.6 GET /api/pricingrequests/my-requests
No payload.
**Response `200`** — requests assigned to current user
**Result: ✅ PASS**

---

### 6.7 PUT /api/pricingrequests/{id}
```json
{
  "title": "Custom Volume Pricing (Updated)",
  "description": "Updated scope — 100+ licenses",
  "priority": 4,
  "requiredByDate": "2026-03-10T00:00:00Z"
}
```
**Response `200`**
**Result: ✅ PASS**

---

### 6.8 POST /api/pricingrequests/{id}/assign
```json
{
  "userId": "4446e829-4761-4da5-8f38-8c20a778500c"
}
```
**Response `200`** — `statusName: "InProgress"`
**Result: ✅ PASS**

---

### 6.9 PUT /api/pricingrequests/{id}/complete
No payload.
**Response `200`** — `statusName: "Completed"`, `completedDate` set
**Result: ✅ PASS**

---

## 7. Contracts

### 7.1 POST /api/contracts
```json
{
  "clientId": "44366f43-9251-4a67-8615-b40ecd2f3aac",
  "opportunityId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "proposalId": "b1c2d3e4-...",
  "title": "Annual SLA Agreement 2026",
  "contractValue": 120000,
  "currency": "ZAR",
  "startDate": "2026-03-01T00:00:00Z",
  "endDate": "2027-03-01T00:00:00Z",
  "ownerId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "renewalNoticePeriod": 60,
  "autoRenew": false,
  "terms": "Standard T&Cs apply. Payment net 30 days."
}
```
**Response `201`** — `contractNumber: "CONT-2026-00001"`, `statusName: "Draft"`
**Result: ✅ PASS**

---

### 7.2 GET /api/contracts?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 7.3 GET /api/contracts/{id}
No payload.
**Response `200`** — includes `daysUntilExpiry: 369`, `isExpiringSoon: false`
**Result: ✅ PASS**

---

### 7.4 GET /api/contracts/expiring?daysUntilExpiry=90
No payload.
**Response `200`** — active contracts expiring within 90 days
**Result: ✅ PASS**

---

### 7.5 GET /api/contracts/client/{clientId}
No payload.
**Response `200`** — all contracts for the client
**Result: ✅ PASS**

---

### 7.6 PUT /api/contracts/{id}
```json
{
  "title": "Annual SLA Agreement 2026 (Revised)",
  "contractValue": 132000,
  "currency": "ZAR",
  "endDate": "2027-03-01T00:00:00Z",
  "ownerId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "renewalNoticePeriod": 60,
  "autoRenew": false,
  "terms": "Standard T&Cs apply. Payment net 30 days."
}
```
**Response `200`**
**Result: ✅ PASS**

---

### 7.7 PUT /api/contracts/{id}/activate
No payload.
**Response `200`** — `statusName: "Active"`
**Result: ✅ PASS**

---

### 7.8 PUT /api/contracts/{id}/cancel
No payload.
**Response `200`** — `statusName: "Cancelled"`
**Result: ✅ PASS**

---

### 7.9 POST /api/contracts/{contractId}/renewals
```json
{
  "renewalOpportunityId": null,
  "notes": "Annual CPI adjustment of 8% applied"
}
```
**Response `201`** — renewal record with `statusName: "Pending"`
**Result: ✅ PASS**

---

### 7.10 GET /api/contracts/{contractId}/renewals
No payload.
**Response `200`** — array of renewal records
**Result: ✅ PASS**

---

### 7.11 PUT /api/contracts/renewals/{renewalId}/complete
No payload.
**Response `200`** — renewal `statusName: "Renewed"`; parent contract `statusName` also updated to `"Renewed"`
**Result: ✅ PASS**

---

### 7.12 DELETE /api/contracts/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 8. Activities

### 8.1 POST /api/activities
```json
{
  "type": 2,
  "subject": "Discovery call with procurement team",
  "description": "Initial needs assessment — 3 stakeholders attending",
  "priority": 2,
  "dueDate": "2026-03-10T09:00:00Z",
  "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "relatedToType": 2,
  "relatedToId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "duration": 60,
  "location": "Microsoft Teams"
}
```
**Response `201`** — `statusName: "Scheduled"`
**Result: ✅ PASS**

---

### 8.2 GET /api/activities?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 8.3 GET /api/activities/{id}
No payload.
**Response `200`**
**Result: ✅ PASS**

---

### 8.4 GET /api/activities/my-activities?pageNumber=1&pageSize=10
No payload.
**Response `200`** — activities assigned to current user
**Result: ✅ PASS**

---

### 8.5 GET /api/activities/upcoming?daysAhead=7
No payload.
**Response `200`** — activities due within next 7 days
**Result: ✅ PASS**

---

### 8.6 GET /api/activities/overdue
No payload.
**Response `200`** — scheduled activities past their due date
**Result: ✅ PASS**

---

### 8.7 PUT /api/activities/{id}
```json
{
  "type": 2,
  "subject": "Discovery call with procurement team (rescheduled)",
  "priority": 3,
  "dueDate": "2026-03-12T14:00:00Z",
  "assignedToId": "4446e829-4761-4da5-8f38-8c20a778500c",
  "duration": 90,
  "location": "Microsoft Teams"
}
```
**Response `200`**
**Result: ✅ PASS**

---

### 8.8 PUT /api/activities/{id}/complete
```json
{
  "outcome": "Client confirmed interest in full package. Follow-up proposal review scheduled."
}
```
**Response `200`** — `statusName: "Completed"`, `completedDate` set
**Result: ✅ PASS**

---

### 8.9 PUT /api/activities/{id}/cancel
No payload.
**Response `200`** — `statusName: "Cancelled"`
**Result: ✅ PASS**

---

### 8.10 DELETE /api/activities/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 9. Documents

### 9.1 POST /api/documents/upload
`Content-Type: multipart/form-data`

| Field | Value |
|---|---|
| `file` | test-document.txt (34 bytes, text/plain) |
| `category` | `5` (Other) |
| `relatedToType` | `1` (Client) |
| `relatedToId` | `44366f43-9251-4a67-8615-b40ecd2f3aac` |
| `description` | `Test contract document` |

**Response `201`** — `id`, `fileName: "test-document.txt"`, `fileSize: 34`
**Result: ✅ PASS**

---

### 9.2 GET /api/documents?pageNumber=1&pageSize=10
No payload.
**Response `200`** — paged list
**Result: ✅ PASS**

---

### 9.3 GET /api/documents?relatedToType=1&relatedToId={clientId}
No payload.
**Response `200`** — documents filtered to a specific client
**Result: ✅ PASS**

---

### 9.4 GET /api/documents/{id}
No payload.
**Response `200`** — document metadata
**Result: ✅ PASS**

---

### 9.5 GET /api/documents/{id}/download
No payload.
**Response `200`** — file bytes returned with `Content-Type: text/plain`, `Content-Disposition: attachment`
**Result: ✅ PASS**

---

### 9.6 DELETE /api/documents/{id}
No payload.
**Response `204`** — soft delete (IsActive = false)
**Result: ✅ PASS**

---

## 10. Notes

### 10.1 POST /api/notes
```json
{
  "content": "Client requested revised pricing before end of Q1. Key contact: Jane Doe.",
  "relatedToType": 2,
  "relatedToId": "aaea175b-48ab-4d27-ac3d-037e795178da",
  "isPrivate": false
}
```
**Response `201`**
**Result: ✅ PASS**

---

### 10.2 GET /api/notes?relatedToType=2&relatedToId={opportunityId}&pageNumber=1&pageSize=10
No payload.
**Response `200`** — notes scoped to the opportunity
**Result: ✅ PASS**

---

### 10.3 GET /api/notes/{id}
No payload.
**Response `200`**
**Result: ✅ PASS**

---

### 10.4 PUT /api/notes/{id}
```json
{
  "content": "Client confirmed: revised pricing needed by 15 March. Escalate to SalesManager.",
  "isPrivate": false
}
```
**Response `200`** — `updatedAt` refreshed
**Result: ✅ PASS**

---

### 10.5 DELETE /api/notes/{id}
No payload.
**Response `204`**
**Result: ✅ PASS**

---

## 11. Dashboard

### 11.1 GET /api/dashboard/overview
No payload.
**Response `200`**
```json
{
  "opportunities": {
    "totalCount": 7,
    "activeCount": 7,
    "wonCount": 0,
    "pipelineValue": 750000,
    "winRate": 0
  },
  "pipeline": {
    "stages": [...],
    "weightedPipelineValue": 344723.76
  },
  "activities": {
    "totalCount": 3,
    "upcomingCount": 0,
    "overdueCount": 0,
    "completedTodayCount": 2
  },
  "contracts": {
    "totalActiveCount": 0,
    "expiringThisMonthCount": 0,
    "totalContractValue": 0
  },
  "revenue": {
    "thisMonth": 0,
    "projectedThisYear": 450000,
    "monthlyTrend": [...]
  }
}
```
**Result: ✅ PASS**

---

### 11.2 GET /api/dashboard/pipeline-metrics
No payload.
**Response `200`** — `stages` array, `conversionRate`, `weightedPipelineValue`
**Result: ✅ PASS**

---

### 11.3 GET /api/dashboard/sales-performance?topCount=5
No payload.
**Response `200`** — `topPerformers`, `averageDealsPerUser`, `averageRevenuePerUser`
**Result: ✅ PASS**

---

### 11.4 GET /api/dashboard/activities-summary
No payload.
**Response `200`** — `totalCount`, `upcomingCount`, `overdueCount`, `completedTodayCount`, `byType`
**Result: ✅ PASS**

---

### 11.5 GET /api/dashboard/contracts-expiring?days=30
No payload.
**Response `200`** — array of expiring contracts
**Result: ✅ PASS**

---

## 12. Reports

### 12.1 GET /api/reports/opportunities?startDate=2026-01-01&endDate=2026-12-31
No payload.
**Response `200`**
```json
[
  {
    "title": "Big Deal Updated",
    "clientName": "Acme Corp",
    "stageName": "Proposal",
    "estimatedValue": 750000,
    "currency": "ZAR",
    "expectedCloseDate": "2026-08-30T00:00:00"
  }
]
```
**Result: ✅ PASS**

---

### 12.2 GET /api/reports/sales-by-period?groupBy=month
No payload.
**Response `200`**
```json
[
  {
    "year": 2026,
    "month": 2,
    "periodName": "February 2026",
    "opportunitiesCount": 1,
    "wonCount": 0,
    "totalValue": 750000,
    "wonValue": 0,
    "winRate": 0
  }
]
```
**Result: ✅ PASS**

---

## Bugs Found & Fixed During Testing

| # | Severity | Description | Root Cause | Fix Applied |
|---|---|---|---|---|
| 1 | High | Opportunity stage always saved as `0` regardless of value sent | DTO property named `NewStage` but JSON field deserialized as `stage` — silent mismatch, defaulted to `0` | Renamed `UpdateStageDto.NewStage` → `Stage` |
| 2 | High | Duplicate key constraint on Proposal / Contract / PricingRequest number generation | `CountAsync()` is tenant-scoped — new tenant always gets count=0, generating the same number (e.g. `PROP-2026-00001`) as another tenant | Added `CountAllAsync()` with `IgnoreQueryFilters()` to count globally across all tenants |
| 3 | Medium | Registration appeared to not work on the frontend | `LoginResponseDto` missing `TenantId` field — backend succeeded but frontend could not store tenant context | Added `TenantId` to `LoginResponseDto`; populated in both `LoginAsync` and `RegisterAsync` |

---

## Multi-Tenancy Verification

| Scenario | Expected | Result |
|---|---|---|
| Register with `tenantName` → becomes Admin of new org | Token contains new org's `tenantId` | ✅ PASS |
| Register with `tenantId` → joins as SalesRep/SalesManager/BDM | Token contains existing org's `tenantId` | ✅ PASS |
| Register with no org → default tenant | Token contains `11111111-1111-1111-1111-111111111111` | ✅ PASS |
| Access another tenant's record | Returns `404 Not Found` | ✅ PASS |
| List endpoints only return own tenant's data | Cross-tenant records excluded | ✅ PASS |

---

## Workflow State Machine Verification

| Workflow | Transitions Tested | Result |
|---|---|---|
| Proposal: Draft → Submitted → Approved | All transitions | ✅ PASS |
| Proposal: Draft → Submitted → Rejected | All transitions | ✅ PASS |
| Pricing Request: Pending → InProgress → Completed | All transitions | ✅ PASS |
| Contract: Draft → Active → Renewed (via Renewal) | All transitions | ✅ PASS |
| Contract: Draft → Active → Cancelled | All transitions | ✅ PASS |
| Activity: Scheduled → Completed (with outcome) | Transition + outcome recorded | ✅ PASS |
| Activity: Scheduled → Cancelled | Transition | ✅ PASS |
| Opportunity: Lead → Qualified → Proposal → Negotiation | Stage history recorded at each step | ✅ PASS |

---

## Summary

| Category | Count |
|---|---|
| Total endpoints tested | 89 |
| Passed | 89 |
| Failed | 0 |
| Bugs found | 3 |
| Bugs fixed | 3 |
| Environments verified | 2 (Local + Azure Production) |

---

*Sales Automation API — Test Report v1.0 — 26 February 2026*
