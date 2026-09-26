# Project instructions

## graphify

- **graphify** (`~/.Codex/skills/graphify/SKILL.md`) — any input to knowledge graph. Trigger: `/graphify`.
- When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

## COSS design system

The user selected the official COSS defaults as the source of truth for this site's design and CV on 26 September 2026.

- Read `docs/design-system.md` before changing visual presentation. Use the pinned COSS style and component registry sources recorded there.
- Use the installed COSS skill at `~/.codex/skills/coss/SKILL.md` for component APIs, composition, styling and accessibility.
- Keep Inter for body and headings, Geist Mono for monospace text, and the official default neutral light/dark tokens. Preserve COSS component geometry, spacing, borders, shadows and state behavior.
- Use COSS primitives and documented variants for UI elements. Add layout and responsive composition around them as the page needs.
- Keep the web CV and exported CV consistent in content, font and palette. Preserve semantic single-column reading order and selectable text in the ATS export.
- Preserve upstream attribution in `THIRD_PARTY_NOTICES.md` when copying or updating registry source.
- Apply these rules directly during authorized implementation and fixes. A later explicit user design direction updates this document and `docs/design-system.md`.
