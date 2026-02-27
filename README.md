Perfect—here’s the **full documentation in pure Markdown**, using your “Les talk” style as the structure but adapted to your **Sales Automation System**.  
I also saved it as a downloadable `.md` file for you: **[sales\_automation.md](blob:https://www.microsoft365.com/0cfa20ff-ea53-4702-9191-caf5b0466cec)**

***

# Sales Automation System (SAS)

## What is the Sales Automation System?

A web-based sales operations platform with a REST API for managing **proposals, pricing requests, contracts, activities, documents, notes**, and organisation-scoped **dashboards/reports**. It streamlines quote-to-contract processes and daily sales execution.

## Why Choose SAS?

*   **Single source of truth** for proposals, contracts, activities, and documents.
*   **Workflow control** with clear status transitions and role-based actions.
*   **Actionable insights** via scoped dashboards and reports.
*   **Simple, consistent API** with predictable resource shapes and pagination.

***

## Documentation

### Software Requirement Specification — Overview

SAS provides modules for:

1.  **Proposals** — draft, submit, approve/reject, and manage line items.
2.  **Pricing Requests** — request, assign, and complete ad‑hoc pricing analysis.
3.  **Contracts** — create/activate/cancel/delete, track renewals and expiries.
4.  **Activities** — schedule/complete/cancel sales tasks linked to any entity.
5.  **Documents** — upload/download metadata & files, soft-delete.
6.  **Notes** — add/update/delete notes on any entity.
7.  **Dashboard & Reports** — organisation-scoped metrics for pipeline and revenue.

> **Conventions**
>
> *   **Dates** use ISO‑8601 (e.g., `2026-03-31`, `2026-03-01T10:00:00`).
> *   **Pagination** parameters: `pageNumber`, `pageSize`.
> *   **Role restrictions** are indicated per endpoint (e.g., *Admin / SalesManager only*).
> *   **Statuses** reference enumerations (see: `ProposalStatus`, `PricingRequestStatus`, `ContractStatus`, `ActivityStatus`, `Priority`, `ActivityType`, `RelatedToType`, `DocumentCategory`).
> *   All dashboard endpoints are **scoped to the current user’s organisation**.

***

## Proposals

### Create Proposal — **Request body shape**

```json
{
  "opportunityId": "...",
  "clientId": "...",
  "title": "Q1 2026 Proposal",
  "description": "Full implementation package",
  "currency": "ZAR",
  "validUntil": "2026-03-31",
  "lineItems": [
    {
      "productServiceName": "Implementation",
      "description": "Phase 1 setup",
      "quantity": 1,
      "unitPrice": 80000,
      "discount": 5,
      "taxRate": 15
    }
  ]
}
```

**Line item total formula**:  
`(Quantity × UnitPrice × (1 − Discount/100)) × (1 + TaxRate/100)`

> **Example**: `1 × 80000 × (1 − 0.05) × (1 + 0.15) = 87 400`

### Endpoints

*   `PUT /api/proposals/{id}` — Update a proposal. **Only when status = Draft**.
*   `POST /api/proposals/{id}/line-items` — Add a line item to an existing **draft** proposal.
*   `PUT /api/proposals/{id}/line-items/{lineItemId}` — Update a line item on a **draft** proposal.
*   `DELETE /api/proposals/{id}/line-items/{lineItemId}` — Remove a line item from a **draft** proposal.
*   `PUT /api/proposals/{id}/submit` — Submit a **draft** proposal for approval → status **Submitted**.
*   `PUT /api/proposals/{id}/approve` — Approve a **submitted** proposal. *Admin / SalesManager only* → status **Approved**.
*   `PUT /api/proposals/{id}/reject` — Reject a **submitted** proposal. *Admin / SalesManager only*.  
    **Request body**: `{ "reason": "Pricing too high, revise and resubmit" }` → status **Rejected**.
*   `DELETE /api/proposals/{id}` — Delete a **draft** proposal. *Admin / SalesManager only*. **204 No Content**.

**Status values** — see `ProposalStatus`.

***

## Pricing Requests

### Endpoints

*   `GET /api/pricingrequests` — List pricing requests.  
    **Query**: `status`, `priority`, `assignedToId`, `pageNumber`, `pageSize`.
*   `GET /api/pricingrequests/{id}` — Get a single pricing request.
*   `GET /api/pricingrequests/pending` — List unassigned pricing requests. *Admin / SalesManager only*.
*   `GET /api/pricingrequests/my-requests` — List pricing requests assigned to the current user.
*   `POST /api/pricingrequests` — Create a pricing request.  
    **Request**:
    ```json
    {
      "opportunityId": "...",
      "title": "Custom Pricing for Client X",
      "description": "Requires volume discount analysis",
      "assignedToId": "...",
      "priority": 3,
      "requiredByDate": "2026-03-15"
    }
    ```
    `assignedToId` is optional. If provided, status auto‑sets to **InProgress**. The requesting user is taken from the token.
*   `PUT /api/pricingrequests/{id}` — Update a pricing request.
*   `POST /api/pricingrequests/{id}/assign` — Assign a pricing request to a user. *Admin / SalesManager only*.  
    **Request**: `{ "userId": "..." }` → status **InProgress**.
*   `PUT /api/pricingrequests/{id}/complete` — Mark a pricing request as complete → status **Completed**.

**Status values** — see `PricingRequestStatus`.  
**Priority values** — see `Priority`.

***

## Contracts

### Endpoints

*   `GET /api/contracts` — List contracts.  
    **Query**: `clientId`, `status`, `pageNumber`, `pageSize`.
*   `GET /api/contracts/{id}` — Get a single contract. Response includes computed fields:  
    `isExpiringSoon` and `daysUntilExpiry`.
*   `GET /api/contracts/expiring` — Get contracts expiring within a given number of days.  
    **Query**: `daysUntilExpiry` (default: `90`).
*   `GET /api/contracts/client/{clientId}` — Get all contracts for a specific client.
*   `POST /api/contracts` — Create a contract.  
    **Request**:
    ```json
    {
      "clientId": "...",
      "opportunityId": "...",
      "proposalId": "...",
      "title": "Annual SLA Agreement",
      "contractValue": 120000,
      "currency": "ZAR",
      "startDate": "2026-01-01",
      "endDate": "2026-12-31",
      "ownerId": "...",
      "renewalNoticePeriod": 90,
      "autoRenew": false,
      "terms": "Standard T&Cs apply"
    }
    ```
*   `PUT /api/contracts/{id}` — Update a contract. **Only when status = Draft or Active**.
*   `PUT /api/contracts/{id}/activate` — Activate a **draft** contract. *Admin / SalesManager only* → status **Active**.
*   `PUT /api/contracts/{id}/cancel` — Cancel a contract. *Admin / SalesManager only* → status **Cancelled**.
*   `DELETE /api/contracts/{id}` — Delete a contract. *Admin only*. **204 No Content**.
*   `POST /api/contracts/{contractId}/renewals` — Create a renewal record for an **active** contract.  
    **Request**:
    ```json
    {
      "renewalOpportunityId": "...",
      "notes": "Annual CPI adjustment of 8%"
    }
    ```
    Both fields optional. `renewalOpportunityId` links this renewal to an existing opportunity tracking the renewal deal.
*   `PUT /api/contracts/renewals/{renewalId}/complete` — Complete a renewal. *Admin / SalesManager only*. Sets contract status to **Renewed**.

**isExpiringSoon**: `true` when status is **Active** **AND** `daysUntilExpiry ≤ renewalNoticePeriod`.

**Status values** — see `ContractStatus`.

***

## Activities

### Endpoints

*   `GET /api/activities` — List activities.  
    **Query**: `assignedToId`, `type`, `status`, `relatedToType`, `relatedToId`, `pageNumber`, `pageSize`.
*   `GET /api/activities/{id}` — Get a single activity.
*   `GET /api/activities/my-activities` — List activities assigned to the current user.  
    **Query**: `status`, `pageNumber`, `pageSize`.
*   `GET /api/activities/upcoming` — Activities due within the next N days.  
    **Query**: `daysAhead` (default: `7`).
*   `GET /api/activities/overdue` — Activities that are **Scheduled** but past their due date.
*   `POST /api/activities` — Create an activity (can be linked to any entity).  
    **Request**:
    ```json
    {
      "type": 2,
      "subject": "Discovery call with procurement",
      "description": "Initial needs assessment",
      "priority": 2,
      "dueDate": "2026-03-01T10:00:00",
      "assignedToId": "...",
      "relatedToType": 2,
      "relatedToId": "...",
      "duration": 60,
      "location": "Microsoft Teams"
    }
    ```
*   `PUT /api/activities/{id}` — Update a scheduled activity.
*   `PUT /api/activities/{id}/complete` — Mark an activity as complete.  
    **Request**: `{ "outcome": "Client confirmed interest. Follow-up scheduled." }`
*   `PUT /api/activities/{id}/cancel` — Cancel a scheduled activity.
*   `DELETE /api/activities/{id}` — Delete an activity. *Admin / SalesManager only*. **204 No Content**.

**Type values** — see `ActivityType`.  
**Status values** — see `ActivityStatus`.  
**Priority values** — see `Priority`.  
**relatedToType values** — see `RelatedToType`.

***

## Documents

### Endpoints

*   `GET /api/documents` — List documents.  
    **Query**: `relatedToType`, `relatedToId`, `category`, `pageNumber`, `pageSize`.

*   `GET /api/documents/{id}` — Get document metadata.

*   `POST /api/documents/upload` — Upload a document. Uses `multipart/form-data`.

    **Form fields**

    | Field           | Type   | Required | Notes                             |
    | --------------- | ------ | -------- | --------------------------------- |
    | `file`          | file   | Yes      | Max 50 MB                         |
    | `category`      | int    | Yes      | See `DocumentCategory`            |
    | `relatedToType` | int    | Yes      | Entity type — see `RelatedToType` |
    | `relatedToId`   | guid   | Yes      | Entity ID to attach to            |
    | `description`   | string | No       |                                   |

*   `GET /api/documents/{id}/download` — Download the file. Returns file bytes with the correct `Content-Type` header.

*   `DELETE /api/documents/{id}` — Soft-delete a document. *Admin / SalesManager only*. **204 No Content**.

**Category values** — see `DocumentCategory`.

***

## Notes

### Endpoints

*   `GET /api/notes` — List notes (optionally scoped to a specific entity).  
    **Query**: `relatedToType`, `relatedToId`, `pageNumber`, `pageSize`.
*   `GET /api/notes/{id}` — Get a single note.
*   `POST /api/notes` — Add a note to any entity.  
    **Request**:
    ```json
    {
      "content": "Client requested revised pricing before end of Q1.",
      "relatedToType": 2,
      "relatedToId": "...",
      "isPrivate": false
    }
    ```
*   `PUT /api/notes/{id}` — Update a note. **Only the note creator** can update it.
*   `DELETE /api/notes/{id}` — Delete a note. **204 No Content**.

**relatedToType values** — see `RelatedToType`.

***

## Dashboard (Org‑Scoped)

*   `GET /api/dashboard/overview` — Full dashboard summary.  
    **Response**:
    ```json
    {
      "opportunities": {
        "totalCount": 42,
        "wonCount": 8,
        "winRate": 19.05,
        "pipelineValue": 1250000
      },
      "pipeline": {
        "stages": [...],
        "weightedPipelineValue": 430000
      },
      "activities": {
        "upcomingCount": 12,
        "overdueCount": 3,
        "completedTodayCount": 5
      },
      "contracts": {
        "totalActiveCount": 15,
        "expiringThisMonthCount": 2,
        "totalContractValue": 3800000
      },
      "revenue": {
        "thisMonth": 180000,
        "thisQuarter": 520000,
        "thisYear": 1100000,
        "monthlyTrend": [...]
      }
    }
    ```
*   `GET /api/dashboard/pipeline-metrics` — Pipeline stage breakdown with counts and values for charting.
*   `GET /api/dashboard/sales-performance` — Top N sales reps by performance. *Admin / SalesManager only*.  
    **Query**: `topCount` (default: `5`).
*   `GET /api/dashboard/activities-summary` — Activity counts grouped by type and status.
*   `GET /api/dashboard/contracts-expiring` — Contracts expiring within N days.  
    **Query**: `days` (default: `30`).

***

## Reports (*Admin / SalesManager only*)

*   `GET /api/reports/opportunities` — Filtered opportunities report.  
    **Query**: `startDate`, `endDate`, `stage`, `ownerId`.
*   `GET /api/reports/sales-by-period` — Revenue grouped by a time period.  
    **Query**: `startDate`, `endDate`, `groupBy` (`month` or `week`).

***

## Status Flow (Reference)

*   **Proposals**: `Draft → Submitted → (Approved | Rejected)`  
    Only **Draft** proposals are editable/deletable and accept line item changes.
*   **Contracts**: `Draft → Active → (Cancelled | Renewed)`  
    Renewals are recorded under `/contracts/{contractId}/renewals` and can be completed, setting the contract status to **Renewed**.
*   **Pricing Requests**: `New → InProgress → Completed`  
    Assigning sets status **InProgress**; completing marks as **Completed**.

> **Note**: Exact enum values are implementation-specific — see: `ProposalStatus`, `ContractStatus`, `PricingRequestStatus`, `ActivityStatus`, `ActivityType`, `Priority`, `RelatedToType`, `DocumentCategory`.

***

## Design

**Mockups & UX**: *TBD* (suggest including screens for Proposals, Pricing Requests, Contracts, Activities, and a Dashboard overview with charts and expiring‑contracts callouts.)

***

## Running the Application

This documentation targets the **API**. For a front‑end, you can consume these endpoints from any SPA/SSR framework. Example steps:

1.  Ensure you have **git** installed.
2.  Clone your repository:  
    `git clone <your-repo-url>`
3.  Configure environment and authentication as per your platform.
4.  Run the API or front‑end locally (implementation‑specific).

**Links**:

*   Front‑end (if hosted): *TBD*
*   GitHub repository: *TBD*

***

## Changelog

*   **2026‑02‑27** — Initial draft of SAS API documentation.

***

If you’d like, I can **add a Table of Contents**, wire in your **actual repo/hosting links**, or include **enum definitions** once you have those.
