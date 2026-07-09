# TODO — Things to address

## 🔴 High

- [ ] **`app.spec.ts` — broken test**
  `src/app/app.spec.ts:21` asserts `querySelector('h1')?.textContent` to contain `'Hello, wms-frontend'`, but the template `app.html` only has `<router-outlet />` — no `<h1>` exists. The test always fails. Also missing `provideRouter([])` provider.
  Fix: Remove or rewrite the test to match actual template content.

- [ ] **`app.component.ts` — dead empty file**
  `src/app/app.component.ts` is 0 bytes. Never imported, never referenced. Leftover from the initial Angular CLI scaffold. The real root is `app.ts`.
  Fix: Delete the file.

- [ ] **`products.ts` — orphaned `OnInit` / `ngOnInit()`**
  `src/app/pages/products/products.ts:1` imports `OnInit` but the class at line 14 does not `implements OnInit`. The `ngOnInit()` method at line 34 exists without the type contract.
  Fix: Either add `implements OnInit` to the class or remove the unused import.

## 🟡 Medium

- [ ] **Hardcoded API URL in 4 services**
  Each service repeats `private apiUrl = 'http://localhost:8080/api'`:
  - `src/app/services/auth.service.ts:11`
  - `src/app/services/product.service.ts:25`
  - `src/app/services/provider.service.ts:19`
  - `src/app/services/orden-retiro.service.ts:38`
  Fix: Centralise via an injection token, environment file, or a shared config service.

- [ ] **`auth.ts` — abandoned empty service**
  `src/app/services/auth.ts` exports an empty `Auth` class. Never imported by any component or service.
  Fix: Delete `auth.ts` and its spec `auth.spec.ts`, or repurpose it.

- [ ] **`auth.spec.ts` — tests dead code**
  `src/app/services/auth.spec.ts` only tests the abandoned `Auth` class. If `auth.ts` is deleted this file must go too.

- [ ] **Missing spec files for 7/10 components**
  Only `app`, `login`, and `register` have tests. Missing specs for:
  - `home`, `admin-home`, `operator-home`, `products`, `providers`, `ordenes-retiro`, `orden-retiro-form`

- [ ] **Spec files missing `provideHttpClientTesting()`**
  `login.spec.ts` and `register.spec.ts` import components that inject `AuthService` -> `HttpClient` but provide no HTTP mock. Tests pass because no actual HTTP call fires, but it is fragile.
  Fix: Add `provideHttpClientTesting()` alongside `provideRouter([])`.

- [ ] **`ordenes-retiro.html` — back link routes to `/` → login**
  `src/app/pages/ordenes-retiro/ordenes-retiro.html:10` has `<a routerLink="/">` which resolves to the root redirect `/` → `/login`. Should navigate back to the user's role-based home instead.
  Fix: Use a method that calls `getHomeRouteByRole()` or navigate back with `location.back()`.

- [ ] **`AGENTS.md` — stale login spec info**
  Currently says `login.spec.ts` imports `Login` — already fixed, it now imports `LoginComponent`.
  Fix: Update the doc.

- [ ] **`register.ts` — `nameMinLength`/`nameMaxLength` dead properties**
  `src/app/pages/register/register.ts:19-20` defines `nameMinLength = 3` and `nameMaxLength = 150`, but the template `register.html:34-35` uses hardcoded `minlength="3"` and `maxlength="150"` instead of binding `[minlength]="nameMinLength"`.
  Fix: Bind the template to the class properties or remove the unused props.

- [ ] **`provider.service.ts` — inconsistent `map` import**
  `src/app/services/provider.service.ts:4` imports `map` from `rxjs/operators` (legacy pipeable operator path). The other services import from `rxjs` directly.
  Fix: Standardise to `import { map } from 'rxjs'`.

## 🟢 Low

- [ ] **Orphaned empty CSS files**
  `src/app/pages/login/login.css` and `src/app/pages/register/register.css` exist on disk but no component references them (no `styleUrl` or `styles` in the decorator).
  Fix: Delete the files.

## ✅ Already fixed

- `login.spec.ts` — import changed from `Login` to `LoginComponent`, added `provideRouter([])`
- `register.spec.ts` — same fix
- `auth.service.ts` — `login()` now accepts `{ cuil, contrasena }`, removed token extraction logic from `saveSession()`
- `login.ts` — form fields renamed from `username`/`password` to `cuil`/`contrasena`
- `login.html` — template bindings updated to match
