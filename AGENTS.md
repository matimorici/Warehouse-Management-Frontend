# AGENTS.md

## Project structure

- **Real app lives in `wms-frontend/`** — all commands must be run from that directory.
- Single Angular 21 SPA (standalone components, signals, no NgModules).
- Build system: `@angular/build` (Vite-based, not Webpack).
- Styling: Tailwind CSS v4 via `@tailwindcss/postcss` PostCSS plugin; `@import 'tailwindcss'` in `styles.css`.
- Testing: Vitest via `@angular/build:unit-test`. Run with `npm test` (which runs `ng test`).
- API base URL is hardcoded to `http://localhost:8080/api` in each service file.

## Commands (run from `wms-frontend/`)

| Command | Action |
|---|---|
| `npm start` | Dev server at `http://localhost:4200` |
| `npm run build` | Production build to `dist/wms-frontend/` |
| `npm test` | Run unit tests (Vitest via Angular CLI) |

- Use `npm run ng <command>` for any Angular CLI command (no global `ng`).
- To change dev port: `npm start -- --port 4300`.

## Code conventions

- **File naming:** `{name}.ts` (component logic), `{name}.html` (template), `{name}.css` (styles), `{name}.spec.ts` (test).
- **Exports:** Component classes are named `{Name}Component` (e.g., `LoginComponent`).
- **Services** use `providedIn: 'root'` (no manual providers needed).
- **Formatting:** Prettier with `singleQuote: true`, `printWidth: 100`, `angular` parser for HTML files.
- **Indent:** 2 spaces, UTF-8, trailing newline required (`.editorconfig`).
- **TypeScript:** strict mode, `noImplicitOverride`, `noPropertyAccessFromIndexSignature`, `isolatedModules`.

## Testing quirks

- Some spec files may import component classes with wrong names (e.g., `login.spec.ts` imports `Login` instead of `LoginComponent`). Verify exports when fixing tests.
- Tests follow `TestBed.configureTestingModule({ imports: [Component] }).compileComponents()` pattern.
- `tsconfig.spec.json` includes `"types": ["vitest/globals"]` — globals like `describe`, `it`, `expect` are available without imports.

## Framework quirks

- Angular 21 uses `@angular/build` application builder (not `@angular-devkit/build-angular`).
- The `test` architect target uses `@angular/build:unit-test` (Vitest, not Karma).
- `angular.json` has `"browser"` (not `"main"`) for the build entry point.
- All routing is lazy-loadable via standalone components.

## Known stale/broken items

- `src/app/services/auth.ts` exports an empty `Auth` class — likely unused/abandoned.
- `login.spec.ts` imports `Login` but the component is exported as `LoginComponent`.
