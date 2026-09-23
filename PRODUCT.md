# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Warehouse administrators and warehouse operators using the system daily from desktop workstations during work shifts. Admins manage employees, products, providers, and withdrawal orders; operators execute operational tasks such as viewing and managing withdrawal orders.

## Product Purpose

An internal warehouse management system for tracking products (stock and pending quantities), providers, employee accounts, and withdrawal orders (órdenes de retiro). Success means a clerk can record, find, and update warehouse information quickly and without error.

## Positioning

Internal operational tool for a single warehouse operation; no external marketing positioning. It differentiates by being a lean, focused alternative to heavyweight ERP suites rather than by any single distinctive mechanism.

## Operating Context

- Spanish-language UI (Rioplatense register, e.g. "podés", CUIL/CUIT identifiers).
- Desktop web app used on shift workstations at high frequency; tasks are repeated throughout the day.
- Two roles visible in navigation: admin panel (employee registration, product load, providers, withdrawal orders) and operator panel (operational tasks).
- API is a local backend at `http://localhost:8080/api`.

## Capabilities and Constraints

Confirmed capabilities (from existing code):

- Login and registration with CUIL + password (auth service).
- Admin: register employees, quick actions to load products, create providers, manage withdrawal orders.
- Operator: start operational tasks, notably withdrawal orders.
- Products: list, create, edit, and load; fields for name, description, barcode, barcode origin, provider, available and pending quantity.
- Providers: create; fields for CUIT, business name, phone, email, address.
- Withdrawal orders: list, create, edit, delete; each order has line items.

Tech constraints: Angular 21 standalone SPA, signals, Tailwind CSS v4, Vitest tests. UI copy is Spanish and product field names come from the backend contract.

Open/undecided: no confirmed company name or brand identity; visual direction (ERP-style vs industrial-terminal) intentionally left open for preview.

## Brand Commitments

No existing brand name, logo, or palette to preserve. UI labels stay generic Spanish; no fabricated company name or identity will be introduced.

## Evidence on Hand

- Full source under `wms-frontend/` (pages for login, register, admin, operator, products, providers, withdrawal orders).
- No production assets, mockups, or previous design system.

## Product Principles

1. Speed over gloss: completing a task quickly is the primary virtue; visual design must never slow a task.
2. Density with clarity: show as much relevant information on screen as safely readable.
3. Consistency across every screen: one table, form, and navigation language everywhere.
4. Fewer mistakes: clear labels, explicit states, and confirmations on destructive actions.
5. Plain Spanish copy, no invented claims or branding.

## Accessibility & Inclusion

Professional workhorse tool used for long shifts; the design must favor high contrast, legible type, and keyboard-operable forms. No specific compliance standard was mandated.