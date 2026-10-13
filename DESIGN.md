---
name: Warehouse Management UI
description: Practical desktop warehouse interface for administrators and operators on long shifts.
colors:
  canvas: "#e9edf0"
  panel: "#ffffff"
  ink: "#17212b"
  ink-soft: "#273542"
  muted: "#5d6a74"
  lines: "#d7dee3"
  accent: "#b87518"
  accent-dark: "#80500e"
  success: "#16745a"
  danger: "#b42318"
rounded:
  work-surface: "2px"
components:
  action-neutral:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.panel}"
    rounded: "{rounded.work-surface}"
  action-success:
    backgroundColor: "{colors.success}"
    textColor: "{colors.panel}"
    rounded: "{rounded.work-surface}"
  action-danger:
    backgroundColor: "{colors.danger}"
    textColor: "{colors.panel}"
    rounded: "{rounded.work-surface}"
  action-secondary:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.work-surface}"
---

# Warehouse Management UI

## Visual Direction

The interface is a practical warehouse workbench for long desktop shifts, deliberately closer to a classic internal WMS than a modern product site. It uses a cool gray desktop canvas, white bordered work panels, compact deep-ink utility bars, and amber operational labels. Primary actions use deep ink with white text for reliable contrast; amber is reserved for markers, focus, and section context. The visual language is dense, square-edged, high contrast, and information-first: no split hero compositions, oversized statements, glass effects, or ornamental motion.

## Colors

The palette is a cool neutral workbench carried by a single operational amber; color signals state and context, never decoration.

### Primary
- **Operational Amber** (`#b87518`): markers, focus rings, and section context. Reserved — never a fill for primary navigation. Darkened to **Amber Deep** (`#80500e`) for amber text and inline links on white surfaces.

### Neutral
- **Desk Canvas** (`#e9edf0`): the application background behind every surface.
- **Work Panel** (`#ffffff`): the surface of every bordered work panel and control.
- **Deep Ink** (`#17212b`): primary text, the utility topbar fill, and the identity mark.
- **Utility Ink** (`#273542`): fill for neutral (non-destructive) action buttons, with white text.
- **Muted Slate** (`#5d6a74`): secondary text — descriptions, hints, metadata, and table captions.
- **Panel Line** (`#d7dee3`): 1px borders and dividers on panels, tables, and controls.

### Semantic Status
- **Confirm Green** (`#16745a`): commits or starts an operation (`.wms-action-success`).
- **Destructive Red** (`#b42318`): removes or cancels a destructive operation (`.wms-action-danger`).

**The Reserved Amber Rule.** Amber marks context, not action. It appears on focus rings, section labels, and state markers; primary navigation and commit actions use ink and green so amber stays legible and meaningful.

## Action Semantics

Buttons communicate intent consistently: green (`wms-action-success`) commits or starts an operation, red (`wms-action-danger`) removes or cancels a destructive operation, and deep ink (`wms-action`) is used for neutral navigation and utility actions. All semantic fills use white text for contrast. Secondary actions remain white with an ink label so they do not compete with the primary action.

## Typography

Body text uses an IBM Plex Sans-compatible workhorse stack. Monospaced text is reserved for small operational metadata and the W mark. Headings use tight tracking and clear weight changes, never display-sized marketing treatments.

## Elevation & Depth

Depth is minimal and functional. Panels carry a single low shadow (`0 1px 2px rgb(23 33 43 / 8%)`); everything else sits flat on the canvas. There are no glows, large blur radii, or layering beyond this one panel shadow.

## Shapes

Square-edged and dense. Work surfaces, controls, inputs, and buttons share a single **2px** radius; borders are thin 1px lines; there are no pills, large radii, or rounded cards.

## Components

Shared classes in `src/styles.css` define the shell (`wms-shell`), dark topbar (`wms-topbar`), identity mark (`wms-mark`), page heading, work panel, action buttons, form fields, error state, focus ring, selection, and scrollbar. New tables and forms should use these primitives instead of introducing page-local color systems.

## Responsive Rules

Desktop layouts stay dense within a `1180px` content measure. At narrow widths, navigation actions wrap naturally, two-column work areas become one column, and the login remains a single bordered panel below the compact application bar.

## Do's and Don'ts

### Do:
- **Do** keep every surface on the shared `wms-*` primitives in `src/styles.css` instead of page-local color systems.
- **Do** use ink fills for neutral navigation and green for commit actions, with white text for contrast.
- **Do** reserve amber for markers, focus, and section context.

### Don't:
- **Don't** introduce glass, gradients, oversized display type, or ornamental motion.
- **Don't** use amber as a primary-action fill or over large areas.
- **Don't** round work surfaces past 2px or add shadows beyond the single panel shadow.
