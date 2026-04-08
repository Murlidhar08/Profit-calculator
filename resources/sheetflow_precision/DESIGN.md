# Design System Strategy: The Financial Architect

## 1. Overview & Creative North Star
The "Financial Architect" is our creative North Star. In a world of cluttered spreadsheets and chaotic data, this design system provides a sanctuary of clarity. It moves beyond the "standard SaaS dashboard" by treating financial data as an editorial narrative. 

We achieve this through **Precision Minimalism**. Instead of relying on rigid, boxed-in grids, we use expansive white space and tonal layering to guide the eye. The layout is intentionally asymmetrical in its information density—allowing high-level insights to breathe in large `Display` type while granular data lives in a highly organized, "paper-on-paper" stacked hierarchy. This is not just a tool; it is a premium workspace that commands trust through restraint.

---

## 2. Colors: Tonal Depth over Borders
Our palette is rooted in a "Trustworthy Blue" core, but we elevate it by using the Material Design logic of tonal containers.

### The "No-Line" Rule
**Explicit Instruction:** You are prohibited from using 1px solid borders to section off major areas of the UI.
Traditional lines create visual noise. Instead, boundaries must be defined by background color shifts. Use the `surface` token for the main app background and `surface-container-low` for sidebars. Use `surface-container-lowest` for primary content cards to create a "lifted" effect without a single line of stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers—like stacked sheets of fine stationery.
- **Base Layer:** `surface` (#f8f9ff)
- **Secondary Workspace:** `surface-container-low` (#eff4ff)
- **Primary Focus Cards:** `surface-container-lowest` (#ffffff)
- **Active Overlays:** `surface-container-highest` (#d3e4fe)

### The "Glass & Gradient" Rule
To escape the "flat" look, use a 5% opacity `surface-tint` (#0053db) combined with a `backdrop-blur` of 12px for floating navigation bars or modal headers. For primary CTAs, do not use a flat blue; use a subtle linear gradient from `primary` (#004ac6) to `primary_container` (#2563eb) at a 135-degree angle to give the button a "jewel" quality.

---

## 3. Typography: The Editorial Edge
We use a dual-font system to balance authority with utility.

- **The Voice (Manrope):** All `display`, `headline`, and `title` levels use Manrope. Its geometric yet warm curves suggest a modern, high-end financial institution. Use `display-lg` (3.5rem) for total profit figures to make them feel like an editorial headline.
- **The Engine (Inter):** All `body` and `label` levels use Inter. It is the workhorse for data. It provides maximum legibility at small scales (e.g., `label-sm` at 0.6875rem) for complex data tables.

**Hierarchy Note:** Use `on_surface_variant` (#434655) for secondary labels to create a clear "read-order" where the actual financial figures (`on_surface`) pop against the metadata.

---

## 4. Elevation & Depth: Tonal Layering
We move away from the "shadow-everything" approach. Depth is a narrative tool.

- **The Layering Principle:** Place a `surface-container-lowest` card atop a `surface-container-low` section. This creates a soft, natural lift. 
- **Ambient Shadows:** For floating elements (Modals, Popovers), use the `on_surface` color as the shadow base but at a 4% alpha with a 32px blur. It should feel like a soft glow of light, not a "drop shadow."
- **The "Ghost Border" Fallback:** If a border is required for accessibility (e.g., an input field), use `outline_variant` at 20% opacity. If the border is 100% opaque, it is a design failure.
- **Glassmorphism:** Use `surface_container_lowest` with 80% opacity and a `backdrop-blur` for a "frosted glass" effect on sticky table headers.

---

## 5. Components
Our components follow a "Soft-Shadcn" philosophy: high functionality with a bespoke finish.

### Data Cards & Lists
*   **The Rule:** Forbid divider lines between list items. Use 12px of vertical white space or a subtle `surface-container` hover state to differentiate rows.
*   **Profit Chips:** Use `secondary` (#006e2d) text on a `secondary_container` (#7cf994) background. The corners must use the `full` (9999px) roundedness for an "organic" feel against the otherwise structured data.

### Buttons
*   **Primary:** Gradient of `primary` to `primary_container`. `xl` (0.75rem) roundedness.
*   **Secondary:** Ghost style. No background, only a `primary` text label.
*   **Tertiary:** `surface_container_high` background with `on_surface` text.

### Input Fields
*   **Style:** Minimalist. No background color (transparent). A "Ghost Border" bottom-only stroke that expands to a full `primary` stroke only on focus. This mimics the feel of a high-end physical ledger.

### The "SheetFlow" Data Grid (Special Component)
*   Instead of standard borders, use alternating row tints of `surface` and `surface-container-low`.
*   The "Header" should be pinned using a `surface_bright` Glassmorphism effect to ensure the data feels like it is flowing "under" the UI.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use `tertiary` (#943700) sparingly for "Warning" states or "Neutral Growth" to provide a sophisticated alternative to yellow.
*   **Do** use `manrope` for any number that represents a "Big Win" for the user.
*   **Do** lean on `surface-container` shifts to define layout regions.

### Don’t:
*   **Don't** use black (#000000) for text. Use `on_surface` (#0b1c30) to maintain a deep, professional navy tone.
*   **Don't** use "Card Shadows" on every element. If everything floats, nothing is important.
*   **Don't** use standard 1px gray dividers. If you feel the need for a line, try adding 8px of empty space instead.