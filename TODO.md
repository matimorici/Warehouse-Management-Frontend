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

- [x] **Hardcoded API URL duplicated across services**
  Every service repeated the base URL literal. It was first moved to a relative `'/api'` (dev proxy), then centralised.
  → **Resolved:** added `src/app/shared/api-config.ts` exporting `API_BASE_URL = '/api'`. All 8 services (`auth`, `product`, `provider`, `orden-retiro`, `location`, `physical-movement`, `purchase-order`, `supplier-rating`) now do `private apiUrl = API_BASE_URL;`, and `app.ts` uses `${API_BASE_URL}/productos`. Base URL changes now happen in one place.

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

## 📄 Pages / surfaces

Already built (pre-existing): login (`/login`), productos list+form (`/productos`), órdenes de retiro list+form (`/ordenes-retiro`, `/ordenes-retiro/nuevo`, `/ordenes-retiro/:id`).

Built in this pass — routes, guards and components (see `src/app/app.routes.ts`):

- [x] **Auth guard + role guard** — `authGuard` / `roleGuard(roles)` in `services/auth.guard.ts`; all operational routes require auth, admin routes (`/admin`, `/register`, `/usuarios`, `/proveedores`) require `ADMIN`, `/operario` requires `OPERARIO`. Unauthorised → `/login`, wrong role → `/sin-acceso`.
- [x] **Logout action** — shared `PageTopbarComponent` (`shared/page-topbar.ts`) with a "Cerrar sesión" button calling `POST /api/auth/logout`, clearing the local session and returning to `/login`. Retrofitted onto every page.
- [x] **Dashboard / Home** — `/home` still just redirects by role; the real landing is `/admin` (live summary: products, stock units, purchase-order statuses, withdrawal orders, movements, locations, plus a "sin stock" table) and `/operario` (task launcher).
- [x] **Producto detail (stock)** — `/productos/:id` (`GET /api/productos/{id}`, stock `GET/PUT …/stock`, barcode `GET …/barcode`). Linked from the productos table ("Ver stock").
- [x] **Proveedores list + edit** — `/proveedores` rewritten with list, create, edit and delete.
- [x] **Ubicaciones list + form** — `/ubicaciones` list/create/edit/delete.
- [x] **Valoraciones de proveedor list + form** — `/valoraciones-proveedor`, filterable by supplier, create/edit/delete.
- [x] **Órdenes de compra list + form + detail + receiving** — `/ordenes-compra`, `/ordenes-compra/nuevo`, `/ordenes-compra/:id`; status badges and a receive-confirmation dialog (`PUT /api/ordenes-compra/{id}/recibir`).
- [x] **Movimientos físicos list + registrar** — `/movimientos-fisicos`, filters (product, user, date range) and an append-only create form.
- [x] **Usuarios list** — `/usuarios` (admin-only) with delete (self-delete blocked).
- [x] **Usuario creation** — reuses `/register` (create-only). Role assignment/edit is **not** possible: `UserController` has no update/role endpoint and new users default to `OPERARIO`.
- [x] **Not-found / 403 page** — `/sin-acceso` (`ForbiddenComponent`) and wildcard `**` → `NotFoundComponent`.
- [x] **Specs** — creation specs for every new component (`product-detail`, `locations`, `supplier-ratings`, `purchase-orders`, `purchase-order-form`, `physical-movements`, `users`, `forbidden`, `not-found`, `page-topbar`); `operator-home.spec.ts` updated with `provideHttpClient()` / `provideHttpClientTesting()`.

> Verified: `npm run build` clean and `npm test` → 20 spec files / 21 tests pass. Node isn't on the sandbox `PATH`; use the portable binary at `/tmp/opencode/node/bin` (prefix `PATH`) when running commands from `wms-frontend/`.

## ✅ Already fixed

- `login.spec.ts` — import changed from `Login` to `LoginComponent`, added `provideRouter([])`
- `register.spec.ts` — same fix
- `auth.service.ts` — `login()` now accepts `{ cuil, contrasena }`, removed token extraction logic from `saveSession()`
- `login.ts` — form fields renamed from `username`/`password` to `cuil`/`contrasena`
- `login.html` — template bindings updated to match
