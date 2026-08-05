# CRMS Design System Specification — Apple Visual Language

CRMS inherits and extends Apple's visual design language. The UI prioritizes extreme clarity, minimal friction, subtle elevation, and responsive typography to deliver a premium user experience for university Class Representatives.

---

## 🎨 Design Tokens

### Color Palette

| Token | Hex / Value | Purpose |
|---|---|---|
| `colors.primary` | `#0066cc` | **Action Blue**: The single brand interactive color for primary buttons, active links, and focus rings. |
| `colors.primaryFocus` | `#0071e3` | Hover & focus state for Action Blue. |
| `colors.primaryOnDark` | `#2997ff` | Sky Link Blue: High-contrast blue used exclusively on dark tile surfaces. |
| `colors.ink` | `#1d1d1f` | Near-black text and body copy on light surfaces. Never use pure `#000000` for body copy. |
| `colors.canvas` | `#ffffff` | Pure white canvas for primary content tiles and utility cards. |
| `colors.canvasParchment` | `#f5f5f7` | Apple's signature off-white surface used for section breaks, header strips, and footers. |
| `colors.surfacePearl` | `#fafafc` | Soft pearl fill for secondary button states. |
| `colors.surfaceTile1` | `#272729` | Primary dark section background. |
| `colors.surfaceTile2` | `#2a2a2c` | Micro-step lighter dark section background. |
| `colors.hairline` | `#e0e0e0` | 1px clean border line for cards and dividers. |

---

## 🔤 Typography Ladder

CRMS uses **SF Pro Display** for headlines (≥ 20px) with negative letter-spacing, and **SF Pro Text** (or Inter fallback) for body and UI elements.

- **Hero Display**: `56px`, Weight 600, Line Height `1.07`, Letter Spacing `-0.28px`
- **Display Large**: `40px`, Weight 600, Line Height `1.10`, Letter Spacing `-0.374px`
- **Tagline / Title**: `21px`, Weight 600, Line Height `1.19`
- **Body Strong**: `17px`, Weight 600, Line Height `1.24`
- **Body**: `17px`, Weight 400, Line Height `1.47` (Apple runs body copy at 17px, not 16px)
- **Caption / Button Utility**: `14px`, Weight 400, Line Height `1.43`
- **Fine Print / Nav**: `12px`, Weight 400, Line Height `1.0`

---

## 📐 Radius Grammar

- `{rounded.none}`: `0px` — Full-bleed structural tile bands.
- `{rounded.sm}`: `8px` — Utility buttons and badges.
- `{rounded.md}`: `11px` — Modal dialogs and pearl capsules.
- `{rounded.lg}`: `18px` — Store cards, utility containers, student profile panels.
- `{rounded.pill}`: `9999px` — **Signature Apple Pill** for primary action CTAs and search inputs.

---

## ⚡ UX Micro-Interactions

1. **Button Scale Press**: Every clickable button uses `transform: scale(0.95)` on active/press state.
2. **Product Shadow**: Exactly one drop-shadow (`rgba(0, 0, 0, 0.22) 0px 5px 30px`) is used for elevated cards/containers resting on parchment. No ad-hoc shadows on text or chrome.
3. **Keyboard-First Focus**: Full keyboard navigation support (Tab, Space, Enter, Arrow keys) for sub-20 second attendance marking.
