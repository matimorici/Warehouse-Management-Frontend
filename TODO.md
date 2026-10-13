# TODO — Things to address

## 🔴 High

- [x] **`app.spec.ts` — broken test**
  Originally asserted `querySelector('h1')?.textContent` contains `'Hello, wms-frontend'` on a template that only has `<router-outlet />`, and was missing `provideRouter([])`.
  → **Resolved (verified):** the spec now imports `App`, providers `provideRouter([])`, and asserts the `router-outlet` exists. No `h1`/`Hello, wms-frontend` assertion remains. Two tests pass.

- [x] **`app.component.ts` — dead empty file**
  0-byte scaffold leftover, never imported; the real root is `app.ts`.
  → **Resolved (verified):** the file no longer exists in `src/app/`.

- [x] **`products.ts` — orphaned `OnInit` / `ngOnInit()`**
  Imported `OnInit` and defined `ngOnInit()` without implementing the interface.
  → **Resolved (verified):** `ProductsComponent implements OnInit` (`products.ts:14`) and `OnInit` is imported (`products.ts:1`).

## 🟡 Medium

- [ ] **Hardcoded API URL in 4 services**
  Each service repeats `private apiUrl = 'http://localhost:8080/api'`:
  - `src/app/services/auth.service.ts:11`
  - `src/app/services/product.service.ts:25`
  - `src/app/services/provider.service.ts:19`
  - `src/app/services/orden-retiro.service.ts:38`
  Fix: Centralise via an injection token, environment file, or a shared config service.
  → **SKIPPED** per request.

- [x] **Missing spec files for 7/10 components**
  Missing specs for `home`, `admin-home`, `operator-home`, `products`, `providers`, `ordenes-retiro`, `orden-retiro-form`.
  → **Resolved:** created all 7 specs. Suite is now 10 spec files / 11 tests, all green.

- [x] **Spec files missing `provideHttpClientTesting()`**
  `login.spec.ts` and `register.spec.ts` inject `AuthService` -> `HttpClient` with no HTTP mock.
  → **Resolved:** added `provideHttpClient()` + `provideHttpClientTesting()` to both specs; the 7 new specs use the same provider pair.

- [x] **`auth.ts` — abandoned empty service**
  Exported an empty `Auth` class, never imported.
  → **Resolved (verified):** `services/auth.ts` is gone. `services/` now holds only `auth.service.ts`, `product.service.ts`, `provider.service.ts`, `orden-retiro.service.ts`.

- [x] **`auth.spec.ts` — tests dead code**
  Only tested the abandoned `Auth` class.
  → **Resolved (verified):** deleted alongside `auth.ts`.

- [x] **`ordenes-retiro.html` — back link routes to `/` → login**
  Header/back links hardcoded `routerLink="/admin"`, wrong for operators.
  → **Resolved:** injected `AuthService` into `OrdenesRetiroComponent`, added a `homeRoute` getter using `getHomeRouteByRole(getUserRole())`, and bound both header links to `[routerLink]="homeRoute"` (`ordenes-retiro.ts:20`, `ordenes-retiro.html:4,7`).

- [x] **`AGENTS.md` — stale login spec info**
  Claimed specs import wrong class names (e.g. `Login`).
  → **Resolved:** replaced with accurate guidance — specs import real class names, and components with `HttpClient` need `provideHttpClient()` + `provideHttpClientTesting()`.

- [x] **`register.ts` — `nameMinLength`/`nameMaxLength` dead properties**
  Class props existed but template used hardcoded values.
  → **Resolved (verified):** the dead properties no longer exist in `register.ts`; the template keeps its literal `minlength="3"` / `maxlength="150"`.

- [x] **`provider.service.ts` — inconsistent `map` import**
  Imported `map` from `rxjs/operators`.
  → **Resolved (verified):** now `import { Observable, map, timeout, catchError } from 'rxjs'` (`provider.service.ts:3`).

## 🟢 Low

- [x] **Orphaned empty CSS files**
  `login.css` and `register.css` existed on disk with no `styleUrl` reference.
  → **Resolved (verified):** both files no longer exist.

## 📄 Pages / surfaces not yet built

Already built: login (`/login`), register (`/register`), admin home (`/admin`), operator home (`/operario`), productos list+form (`/productos`), proveedores create-form (`/proveedores`), órdenes de retiro list+form (`/ordenes-retiro`, `/ordenes-retiro/nuevo`, `/ordenes-retiro/:id`).

- [ ] **Dashboard / Home real** — `/home` is a stub that only redirects. Post-login landing showing key data (stock, pending orders). Route guessed from LOGIN redirect; decide auth-guard + post-login routing.
- [ ] **Logout action** — no logout exists anywhere (no button, no `POST /api/auth/logout` call). Add as header action, not a page.
- [ ] **Producto detail (stock)** — `GET /api/productos/{id}/stock`, editable stock (`PUT …/stock`), barcode image (`GET …/barcode`). Current `productos` page only has form + inline table.
- [ ] **Proveedores list** — `GET /api/proveedores`. Only the create form exists; no list/edit.
- [ ] **Ubicaciones list** — `GET /api/ubicaciones`.
- [ ] **Ubicación form** — create/edit.
- [ ] **Valoraciones de proveedor list** — `GET /api/valoraciones-proveedor`, filterable by supplier.
- [ ] **Valoración form** — create/edit.
- [ ] **Órdenes de compra list** — `GET /api/ordenes-compra` (summaries + status).
- [ ] **Orden de compra form** — create/edit, lines of product + amount.
- [ ] **Orden de compra detail** — with "Recibir" action (`PUT /api/ordenes-compra/{id}/recibir`).
- [ ] **Receiving confirmation** — modal updating stock; can live on compra detail.
- [ ] **Movimientos físicos list** — `GET /api/movimientos-fisicos`, filters: product, user, date range.
- [ ] **Registrar movimiento** form — `POST`, append-only event.
- [ ] **Usuarios list** — `GET /api/usuarios` (admin-only).
- [ ] **Usuario form** — create/edit, set role/rol (admin-only).
- [ ] **Not-found / 403 page** — routing is role-gated (OPERARIO vs ADMINISTRADOR); no error page exists. `**` currently redirects to login.

## ✅ Already fixed

- `login.spec.ts` — import changed from `Login` to `LoginComponent`, added `provideRouter([])`
- `register.spec.ts` — same fix
- `auth.service.ts` — `login()` now accepts `{ cuil, contrasena }`, removed token extraction logic from `saveSession()`
- `login.ts` — form fields renamed from `username`/`password` to `cuil`/`contrasena`
- `login.html` — template bindings updated to match
