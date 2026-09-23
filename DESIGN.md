# Warehouse Management UI

## Visual Direction

The interface is a practical warehouse workbench for long desktop shifts, deliberately closer to a classic internal WMS than a modern product site. It uses a cool gray desktop canvas, white bordered work panels, compact deep-ink utility bars, and a restrained amber action color. The visual language is dense, square-edged, high contrast, and information-first: no split hero compositions, oversized statements, glass effects, or ornamental motion.

## Tokens

- Canvas: `#e9edf0`
- Panel: `#ffffff`
- Ink: `#17212b`
- Muted text: `#5d6a74`
- Lines: `#d7dee3`
- Action accent: `#b87518`
- Success: `#16745a`
- Danger: `#b42318`
- Radius: `2px` for work surfaces and controls
- Elevation: a minimal `0 1px 2px` shadow on panels only

## Typography

Body text uses an IBM Plex Sans-compatible workhorse stack. Monospaced text is reserved for small operational metadata and the W mark. Headings use tight tracking and clear weight changes, never display-sized marketing treatments.

## Components

Shared classes in `src/styles.css` define the shell (`wms-shell`), dark topbar (`wms-topbar`), identity mark (`wms-mark`), page heading, work panel, action buttons, form fields, error state, focus ring, selection, and scrollbar. New tables and forms should use these primitives instead of introducing page-local color systems.

## Responsive Rules

Desktop layouts stay dense within a `1180px` content measure. At narrow widths, navigation actions wrap naturally, two-column work areas become one column, and the login remains a single bordered panel below the compact application bar.
