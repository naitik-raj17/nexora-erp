# Database design and ERD

Nexora uses one PostgreSQL 17 database in third normal form. Each module owns its own group of tables, and only six business foreign keys cross module boundaries (plus the `created_by` and `updated_by` audit columns that point to `USER`).

## Module overview

![Module-level ERD: cross-module foreign keys](images/erd-overview.png)

| Module | Tables |
| --- | --- |
| Core | `USER`, `ROLE`, `PERMISSION`, `USER_ROLE`, `ROLE_PERMISSION`, `DEPARTMENT`, `AUDIT_LOG` |
| HR | `EMPLOYEE`, `LEAVE_REQUEST`, `ATTENDANCE`, `PAYROLL_RUN`, `PAYSLIP` |
| Finance | `ACCOUNT`, `JOURNAL_ENTRY`, `JOURNAL_LINE`, `CUSTOMER`, `INVOICE`, `BILL`, `PAYMENT` |
| Procurement | `VENDOR`, `REQUISITION`, `PURCHASE_ORDER`, `PO_LINE`, `GOODS_RECEIPT` |
| Inventory | `CATEGORY`, `PRODUCT`, `WAREHOUSE`, `STOCK_MOVEMENT`, `STOCK_LEVEL` |
| Reporting | SQL views only: `v_trial_balance`, `v_profit_and_loss`, `v_stock_valuation`, `v_payroll_summary`, `v_ap_aging` |

## Cross-module relationships

| From | To | Cardinality | Meaning |
| --- | --- | --- | --- |
| `EMPLOYEE.user_id` | `USER` | 1 : 1 | An employee may have a login |
| `EMPLOYEE.department_id` | `DEPARTMENT` | many : 1 | Every employee belongs to one department |
| `PAYROLL_RUN.journal_entry_id` | `JOURNAL_ENTRY` | 1 : 1 | A confirmed payroll run posts one salary journal |
| `BILL.purchase_order_id` | `PURCHASE_ORDER` | many : 1 | Vendor bills are matched to a purchase order |
| `PO_LINE.product_id` | `PRODUCT` | many : 1 | Each order line buys one product |
| `STOCK_MOVEMENT.goods_receipt_id` | `GOODS_RECEIPT` | many : 1 | A goods receipt creates stock-in movements |

## Detailed ERD

The detailed ERD is split by module so each diagram stays readable. Tables owned by another module appear without columns.

## Core and HR

```mermaid
erDiagram
    USER ||--o{ USER_ROLE : has
    ROLE ||--o{ USER_ROLE : "assigned via"
    ROLE ||--o{ ROLE_PERMISSION : grants
    PERMISSION ||--o{ ROLE_PERMISSION : "granted via"
    USER ||--o{ AUDIT_LOG : writes
    USER |o--o| EMPLOYEE : "logs in as"
    DEPARTMENT ||--o{ EMPLOYEE : employs
    EMPLOYEE ||--o{ LEAVE_REQUEST : submits
    EMPLOYEE ||--o{ ATTENDANCE : records
    PAYROLL_RUN ||--|{ PAYSLIP : produces
    EMPLOYEE ||--o{ PAYSLIP : receives
    PAYROLL_RUN |o--o| JOURNAL_ENTRY : posts
    USER {
        uuid id PK
        string email UK
        string password_hash
        string full_name
        boolean is_active
        timestamp last_login_at
    }
    ROLE {
        uuid id PK
        string name UK
        string description
    }
    PERMISSION {
        uuid id PK
        string code UK "e.g. procurement:approve"
    }
    USER_ROLE {
        uuid user_id PK, FK
        uuid role_id PK, FK
    }
    ROLE_PERMISSION {
        uuid role_id PK, FK
        uuid permission_id PK, FK
    }
    AUDIT_LOG {
        bigint id PK
        uuid user_id FK
        string entity
        uuid entity_id
        string action
        jsonb before
        jsonb after
        timestamp created_at
    }
    DEPARTMENT {
        uuid id PK
        string name UK
        uuid manager_id FK
    }
    EMPLOYEE {
        uuid id PK
        string employee_code UK
        uuid user_id FK
        uuid department_id FK
        string designation
        date joining_date
        decimal base_salary
        string status
    }
    LEAVE_REQUEST {
        uuid id PK
        uuid employee_id FK
        string leave_type
        date start_date
        date end_date
        string status
        uuid approved_by FK
    }
    ATTENDANCE {
        uuid id PK
        uuid employee_id FK
        date work_date
        string status
    }
    PAYROLL_RUN {
        uuid id PK
        string period "YYYY-MM"
        string status
        uuid journal_entry_id FK
    }
    PAYSLIP {
        uuid id PK
        uuid payroll_run_id FK
        uuid employee_id FK
        decimal gross_pay
        decimal deductions
        decimal net_pay
    }
```

## Finance

```mermaid
erDiagram
    PAYROLL_RUN |o--o| JOURNAL_ENTRY : posts
    JOURNAL_ENTRY ||--|{ JOURNAL_LINE : contains
    ACCOUNT ||--o{ JOURNAL_LINE : "posted to"
    CUSTOMER ||--o{ INVOICE : "billed on"
    VENDOR ||--o{ BILL : issues
    INVOICE ||--o{ PAYMENT : "settled by"
    BILL ||--o{ PAYMENT : "settled by"
    PURCHASE_ORDER ||--o{ BILL : "billed on"
    ACCOUNT {
        uuid id PK
        string code UK
        string name
        string type "asset, liability, equity, income, expense"
        uuid parent_id FK
    }
    JOURNAL_ENTRY {
        uuid id PK
        string entry_no UK
        date entry_date
        string source "manual, payroll, grn, payment"
        string status "draft, posted, reversed"
    }
    JOURNAL_LINE {
        uuid id PK
        uuid journal_entry_id FK
        uuid account_id FK
        decimal debit
        decimal credit
    }
    CUSTOMER {
        uuid id PK
        string name
        string email
        string tax_id
    }
    INVOICE {
        uuid id PK
        string invoice_no UK
        uuid customer_id FK
        date due_date
        decimal total
        string status
    }
    BILL {
        uuid id PK
        string bill_no UK
        uuid vendor_id FK
        uuid purchase_order_id FK
        decimal total
        string status
    }
    PAYMENT {
        uuid id PK
        uuid invoice_id FK
        uuid bill_id FK
        date paid_on
        decimal amount
        string method
    }
```

## Procurement and Inventory

```mermaid
erDiagram
    VENDOR ||--o{ BILL : issues
    DEPARTMENT ||--o{ REQUISITION : raises
    REQUISITION |o--o| PURCHASE_ORDER : becomes
    VENDOR ||--o{ PURCHASE_ORDER : receives
    PURCHASE_ORDER ||--|{ PO_LINE : contains
    PRODUCT ||--o{ PO_LINE : "ordered in"
    PURCHASE_ORDER ||--o{ GOODS_RECEIPT : "received via"
    PURCHASE_ORDER ||--o{ BILL : "billed on"
    GOODS_RECEIPT ||--|{ STOCK_MOVEMENT : creates
    CATEGORY ||--o{ PRODUCT : groups
    PRODUCT ||--o{ STOCK_MOVEMENT : moves
    WAREHOUSE ||--o{ STOCK_MOVEMENT : "happens in"
    PRODUCT ||--o{ STOCK_LEVEL : "balance of"
    WAREHOUSE ||--o{ STOCK_LEVEL : holds
    VENDOR {
        uuid id PK
        string name
        string email
        string tax_id
        int payment_terms_days
    }
    REQUISITION {
        uuid id PK
        uuid department_id FK
        uuid requested_by FK
        decimal estimated_total
        string status
    }
    PURCHASE_ORDER {
        uuid id PK
        string po_no UK
        uuid vendor_id FK
        uuid requisition_id FK
        date expected_date
        decimal total
        string status
    }
    PO_LINE {
        uuid id PK
        uuid purchase_order_id FK
        uuid product_id FK
        decimal quantity
        decimal unit_price
        decimal received_qty
    }
    GOODS_RECEIPT {
        uuid id PK
        string grn_no UK
        uuid purchase_order_id FK
        uuid warehouse_id FK
        date received_on
    }
    CATEGORY {
        uuid id PK
        string name UK
    }
    PRODUCT {
        uuid id PK
        string sku UK
        string name
        uuid category_id FK
        string unit
        decimal reorder_level
        decimal avg_cost
    }
    WAREHOUSE {
        uuid id PK
        string code UK
        string name
        string address
    }
    STOCK_MOVEMENT {
        uuid id PK
        uuid product_id FK
        uuid warehouse_id FK
        uuid goods_receipt_id FK
        string type "in, out, transfer, adjust"
        decimal quantity
        decimal unit_cost
        timestamp moved_at
    }
    STOCK_LEVEL {
        uuid product_id PK, FK
        uuid warehouse_id PK, FK
        decimal on_hand
    }
```

## Design rules

| Rule | Detail |
| --- | --- |
| Keys | UUID primary keys (UUID v7 for index-friendly ordering); human-readable numbers such as `PO-2026-0001` in separate unique columns |
| Money and quantities | `NUMERIC(14,2)` for money, `NUMERIC(14,3)` for quantities; never floating point |
| Common columns | Every table has `created_at`, `updated_at`, `created_by`, `updated_by`; master data has `deleted_at` for soft delete |
| Double entry | A database check plus a service rule: the sum of debits equals the sum of credits for every posted journal entry |
| Immutability | Posted journals, payslips and stock movements are never updated; corrections are reversing records |
| Stock balances | `STOCK_LEVEL` is updated in the same transaction as each `STOCK_MOVEMENT`, so on-hand quantity is always consistent |
| Indexes | Foreign keys, status columns and date columns used in report filters (e.g. `journal_entry.entry_date`, `stock_movement.moved_at`) |
| Migrations | Versioned Prisma migrations committed to Git; the seed script loads roles, permissions, a chart of accounts and demo data |
