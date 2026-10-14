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
- [x] **Dashboard / Home** — `/home` still just redirects by role; the real landing is `/admin` (alerts for pending purchase orders and products with zero stock, followed by grouped administration links) and `/operario` (task launcher).
- [x] **Producto detail (stock)** — `/productos/:id` (`GET /api/productos/{id}`, stock `GET/PUT …/stock`, barcode `GET …/barcode`). Linked from the productos table ("Ver stock").
- [x] **Proveedores list + edit** — `/proveedores` rewritten with list, create, edit and delete.
- [x] **Ubicaciones list + form** — `/ubicaciones` list/create/edit/delete.
- [x] **Valoraciones de proveedor list + form** — `/valoraciones-proveedor`, filterable by supplier, create/edit/delete.
- [x] **Órdenes de compra list + form + detail + receiving** — `/ordenes-compra`, `/ordenes-compra/nuevo`, `/ordenes-compra/:id`; status badges and a receive-confirmation dialog (`PUT /api/ordenes-compra/{id}/recibir`).
- [x] **Movimientos físicos list + registrar** — `/movimientos-fisicos`, filters (product, user, date range) and an append-only create form.
- [x] **Usuarios list** — `/usuarios` (admin-only) with delete (self-delete blocked).
- [x] **Usuario creation** — reuses `/register` (create-only). Role assignment/edit is **not** possible: `UserController` has no update/role endpoint and new users default to `OPERARIO`.
- [x] **Not-found / 403 page** — `/sin-acceso` (`ForbiddenComponent`) and wildcard `**` → `NotFoundComponent`.
- [x] **Specs** — creation specs for every new component (`product-detail`, `locations`, `supplier-ratings`, `purchase-orders`, `purchase-order-form`, `physical-movements`, `users`, `forbidden`, `not-found`, `page-topbar`); `admin-home.spec.ts` now covers its four data states and `page-topbar.spec.ts` covers the displayed identity.

### Pendientes de contrato del backend — panel de administración

- [ ] **Confirmar si `GET /productos` devuelve el catálogo completo o una página** — El frontend acepta arrays y respuestas `{ content: [...] }`, pero descarta metadatos como `totalElements`. Hasta confirmar el contrato, el panel sólo describe las coincidencias de la respuesta recibida y no presenta sus cantidades como totales.
- [ ] **Definir el umbral de stock bajo** — No hay una regla de negocio confirmada; no mostrar esta alerta hasta acordar el umbral y dónde se configura.
- [ ] **Exponer el estado de las órdenes de retiro** — `OrdenRetiroResponse` no incluye estado, por lo que el frontend no puede determinar qué órdenes siguen abiertas. Definir estado y criterio antes de sumar esa alerta.
- [ ] **Evaluar un endpoint agregado de conteos para el panel** — Hoy el frontend consulta las órdenes de compra completas para contar las pendientes y los productos para detectar stock cero. Un endpoint de resumen evitaría descargar listas completas y permitiría devolver totales inequívocos.

> Historical verification: at that point, `npm run build` was clean and `npm test` reported 20 spec files / 21 passing tests. The later signal migration changed component APIs; update affected specs before relying on that earlier test result. Node isn't on the sandbox `PATH`; use the portable binary at `/tmp/opencode/node/bin` (prefix `PATH`) when running commands from `wms-frontend/`.

## ✅ Already fixed

- `login.spec.ts` — import changed from `Login` to `LoginComponent`, added `provideRouter([])`
- `register.spec.ts` — same fix
- `auth.service.ts` — `login()` now accepts `{ cuil, contrasena }`, removed token extraction logic from `saveSession()`
- `login.ts` — form fields renamed from `username`/`password` to `cuil`/`contrasena`
- `login.html` — template bindings updated to match

## 🔎 Revisión de estructura y buenas prácticas — 2026-10-14

### Lo que ya está bien encaminado

- Componentes standalone, TypeScript estricto y plantillas con `strictTemplates`.
- Separación comprensible entre `pages/`, `services/` y `shared/`, con interfaces para la mayoría de los contratos de API.
- URL de API centralizada, rutas/guardas agrupadas y una barra superior reutilizada.
- El estado asíncrono de las pantallas ya usa señales, compatible con el modelo zoneless de Angular 21.

### 🔴 Prioridad alta

- [ ] **Actualizar y ampliar las specs después de migrar a señales** — La mayoría de las specs todavía comprueba sólo `should create`. `admin-home.spec.ts` cubre carga, error con reintento, respuesta vacía y datos; `locations.spec.ts` ya lee sus señales correctamente. Sumar estados de plantilla en los listados restantes.
- [ ] **Quitar Zone.js si no hay dependencias ocultas** — Angular 21 usa zoneless por defecto y el estado de las vistas ya se actualiza con señales. `angular.json` todavía carga `zone.js` y `package.json` lo conserva. Confirmar que ninguna librería requiere Zone.js; después quitar el polyfill, la dependencia y su entrada del lockfile.
- [ ] **Verificar autorización en el backend** — `authGuard` y `roleGuard` leen el rol desde `localStorage`; sirven para navegación, pero el cliente puede modificarlos. Confirmar que cada endpoint protegido valida la sesión y los permisos en el servidor.

### 🟡 Prioridad media

- [ ] **Cargar páginas bajo demanda** — `app.routes.ts` importa todas las páginas de forma estática. Migrar rutas a `loadComponent` para dividir el bundle inicial, sobre todo las pantallas administrativas que no todos los usuarios necesitan.
- [ ] **Eliminar tipos `any` y casts engañosos** — `AuthService`, `ProductService` y `ProviderService` retornan `Observable<any>`. Definir DTOs de entrada/salida. En `products.ts`, reemplazar `null as unknown as number` por tipos de formulario que acepten `null` y validar antes de enviar.
- [ ] **Hacer explícito el inicio de CSRF** — `App` dispara un GET a `/productos` en el constructor y descarta errores para obtener la cookie CSRF. Documentar la dependencia y garantizar que termine antes del primer POST; idealmente, integrarlo en el flujo de autenticación o en una inicialización explícita.
- [ ] **Unificar manejo de errores y timeout HTTP** — Los servicios repiten `timeout(15000)` y `catchError` con `console.error`, y varias pantallas vuelven a registrar el mismo error. Centralizar el manejo de transporte/logging (por ejemplo, con un interceptor o helper) y dejar en cada página el mensaje de usuario específico.
- [ ] **Agregar comandos de calidad al proyecto** — Prettier está instalado, pero `package.json` no ofrece scripts de formato ni hay configuración de lint. Agregar `format:check` y lint con Angular ESLint para detectar problemas antes del build.
- [ ] **Evitar temporizadores de navegación sin cancelar** — Los formularios de registro y órdenes usan `setTimeout` después de guardar. Si el componente se destruye antes, el temporizador sigue activo. Usar un flujo RxJS cancelable o navegar en un momento explícito del flujo de éxito.

### 🟢 Prioridad baja / al crecer el proyecto

- [ ] **Agrupar contratos y servicios por funcionalidad cuando aumente el tamaño** — Hoy la división `pages/`, `services/` y `shared/` es fácil de recorrer. Si aparecen más pantallas por dominio, mover modelos/servicios junto a `ordenes-retiro/`, `productos/`, etc., evitando crear capas genéricas antes de necesitarlas.
- [ ] **Revisar componentes reutilizables de listado y formulario** — Varias páginas repiten tablas, estados de carga/vacío/error y acciones CRUD. Extraer sólo patrones que ya tengan comportamiento y presentación estables para reducir divergencias sin introducir abstracciones prematuras.

## 🎛️ Revisión de patrones de interacción y UX — 2026-10-14

### Patrones que ya ayudan

- Los formularios suelen tener etiquetas visibles, validación en línea y un estado de guardado.
- Los listados usan estados vacíos y filtros cuando la tarea lo necesita; las órdenes de compra muestran estados reconocibles con badges.
- La barra superior compartida y los tokens globales dan consistencia entre pantallas.

### 🔴 Prioridad alta

- [x] **Hacer mutuamente excluyentes los estados de listado** — Órdenes de retiro ya no muestra el estado vacío cuando la consulta falla y permite reintentar; órdenes de compra también separa error de lista vacía.
- [x] **Explicar y recuperar fallos al cargar opciones de formularios** — Los formularios de órdenes de retiro y compra muestran el fallo junto al selector, permiten reintentar y bloquean el envío mientras faltan opciones. Movimientos físicos también permite reintentar sus listas de productos, ubicaciones y usuarios.
- [x] **Evitar envíos duplicados** — Orden de retiro expone el estado de guardado, cambia el texto del botón y bloquea nuevos envíos durante la solicitud.

### 🟡 Prioridad media

- [x] **Mostrar datos legibles y localizados** — Órdenes de retiro muestra el nombre de usuario y usa el ID como respaldo. Fechas de órdenes, movimientos, valoraciones y stock usan `dd/MM/yyyy, HH:mm` con la zona local del navegador.
- [x] **Unificar confirmación de acciones destructivas** — Los borrados usan un diálogo compartido que nombra el registro, describe que la acción no se puede deshacer, permite cancelar con Escape y enfoca Cancelar al abrirse.
- [x] **Separar carga, error, vacío y datos en el panel de administración** — Cada fuente tiene su propio estado y reintento; un fallo ya no se convierte en una lista vacía ni se anuncia como cero confirmado.
- [x] **Completar el flujo de validación del formulario** — Las órdenes permiten enviar para recibir mensajes de validación, muestran errores junto a campos inválidos y enfocan el primer campo inválido. Los mensajes globales de éxito/error se anuncian con regiones accesibles.

### 🟢 Prioridad baja / validar con uso real

- [ ] **Revisar tablas en móvil** — El contenedor permite scroll horizontal, pero falta validar visualmente con anchos pequeños y comprobar que las acciones clave queden fáciles de descubrir.
- [ ] **Añadir búsqueda, orden y paginación según volumen** — Antes de agregar controles a todos los listados, confirmar cuántos registros usan en operación. Incorporar búsqueda/orden/paginación primero en las listas que crezcan o se consulten con frecuencia.
