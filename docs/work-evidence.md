# Selected work sources

Reviewed on 30 September 2026. Project descriptions are grounded in the owner's repositories and public pages. Existing Surfel, portfolio and SkyWise case studies remain in place. The selected order is Surfel, cxbilen.com, Dev Migration Assistant, PlayAgain, Looplift, Maestro, SkyWise, LENZ and ZEDrift.

The expanded galleries, capture routes and evidence limits are recorded in [Project gallery sources and verification](project-gallery-verification.md).

## Dev Migration Assistant

- Public repository: https://github.com/CXBilen/dev-migration-assistant
- README, `apps/desktop/package.json`, `packages/archive/src/crypto-stream.ts`, core/provider packages and tests establish the Electron/React application, Git/context migration and encrypted archive implementation.
- Published release: https://github.com/CXBilen/dev-migration-assistant/releases/tag/v1.0.0
- Images come from `docs/assets/screenshots/home.png`, `backup-projects.png`, `restore.png` and `diagnostics.png`. They show an earlier development preview, including the preview-data label, so the case study identifies them accordingly.

## PlayAgain

- Owner's private repository: `CXBilen/playagain`.
- README, package manifest, `src/app/api/realtime/route.ts`, realtime clients/protocol tests and the transport-switch E2E file establish the host/controller, WebSocket/WebRTC and browser emulation implementation.
- Public product URL https://www.playagain.app returned HTTP 200 during review.
- Four new screenshots show the live landing page, host room, paired phone controller and built-in Demo Arena. The controller was connected through WebSocket; the demo illustrates input handling.

## Looplift

- Owner's private repository: `CXBilen/looplift`.
- README, `lib/audit/run.ts`, audit API and declarative patch ADR establish the audit, variant and experiment workflow.
- The README labels the product private beta and explicitly records the lack of a statistically conclusive experiment. The case study preserves that distinction.
- The cover and three more screenshots show the owner's live store account: overview in two themes, audit findings and experiment states. The captured account has no running tests or shipped winners. The public landing page at https://www.looplift.io remains in the gallery with its illustrative experiment example labeled.

## Maestro

- Owner's private repository: `CXBilen/maestro`.
- README, `runtime/orchestrator/src/pipeline.ts` and `app/api/worker/stream/route.ts` establish the Next.js workspace, worker boundary, job transitions, persistence and streamed output.
- The public domain refused connections during review. The case study describes the engineering project without a live availability claim.
- The cover is a project-specific architecture diagram based on those sources, labeled as a diagram rather than an application screenshot.
- Additional screenshots show the unchanged local product workflow section and desktop/mobile login interfaces. No authenticated workspace or AI task was executed during capture.

## LENZ

- Owner's private repository: `CXBilen/lenz`.
- README, `app/api/ai-tryon/route.ts` and `app/api/v1/tryon/create/route.ts` establish the Gemini integration, merchant API boundaries and Supabase application. Billing, widget and Shopify routes are present in the source tree.
- The public landing page at https://lenz.style supplies the current cover image. Additional public demo screenshots show desktop product selection and mobile garment URL input; image generation was not executed during this capture.
- The case study describes implementation and does not repeat the landing page's conversion metrics as measured project results.

## ZEDrift

- Owner's private repository: `CXBilen/zedrift`.
- README, `zedrift-client/src/App.tsx`, game modules and `zedrift-server/src/index.js` establish React/Three.js rendering, driving physics and Express/Socket.IO connections. Prisma and container configuration support the backend description.
- The public domain did not resolve during review. The case study presents the game project without a live availability claim.
- The cover is the existing `zedrift-client/public/maps/city_plan.png` asset, labeled as a city map.
- Additional screenshots show the unchanged local login/signup and mobile login interfaces. The game server was offline and registration was not submitted.

## Badge presentation

The local Badge source matches the pinned COSS registry. Default desktop badges use 18px height, 12px font and 3px horizontal padding. Following the owner's clarification on 30 September 2026, project cards and case-study tags retain the default height and font (18px/12px on desktop, 22px/14px on mobile) and add `px-2` for 8px horizontal padding. Their layout uses an 8px gap. This corrects the earlier `lg` implementation, which increased badge height and text size. The primitive source remains pinned and unchanged.
