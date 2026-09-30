# Selected work sources

Reviewed on 30 September 2026. Project descriptions are grounded in the owner's repositories and public pages. Existing Surfel, portfolio and SkyWise case studies remain in place. The selected order is Surfel, cxbilen.com, Dev Migration Assistant, PlayAgain, Looplift, Maestro, SkyWise, LENZ and ZEDrift.

## Dev Migration Assistant

- Public repository: https://github.com/CXBilen/dev-migration-assistant
- README, `apps/desktop/package.json`, `packages/archive/src/crypto-stream.ts`, core/provider packages and tests establish the Electron/React application, Git/context migration and encrypted archive implementation.
- Published release: https://github.com/CXBilen/dev-migration-assistant/releases/tag/v1.0.0
- Images come from `docs/assets/screenshots/home.png` and `backup-projects.png`. They show an earlier development preview, including the preview-data label, so the case study identifies them accordingly.

## PlayAgain

- Owner's private repository: `CXBilen/playagain`.
- README, package manifest, `src/app/api/realtime/route.ts`, realtime clients/protocol tests and the transport-switch E2E file establish the host/controller, WebSocket/WebRTC and browser emulation implementation.
- Public product URL https://www.playagain.app returned HTTP 200 during review.
- Images come from `docs/images/landing.png`, `tv-lobby.png` and `controller.png`. These are development images; the visible pairing URL is local.

## Looplift

- Owner's private repository: `CXBilen/looplift`.
- README, `lib/audit/run.ts`, audit API and declarative patch ADR establish the audit, variant and experiment workflow.
- The README labels the product private beta and explicitly records the lack of a statistically conclusive experiment. The case study preserves that distinction.
- The public landing page at https://www.looplift.io returned HTTP 200. The cover is a screenshot of that page, including its illustrative experiment example.

## Maestro

- Owner's private repository: `CXBilen/maestro`.
- README, `runtime/orchestrator/src/pipeline.ts` and `app/api/worker/stream/route.ts` establish the Next.js workspace, worker boundary, job transitions, persistence and streamed output.
- The public domain refused connections during review. The case study describes the engineering project without a live availability claim.
- The cover is a project-specific architecture diagram based on those sources, labeled as a diagram rather than an application screenshot.

## LENZ

- Owner's private repository: `CXBilen/lenz`.
- README, `app/api/ai-tryon/route.ts` and `app/api/v1/tryon/create/route.ts` establish the Gemini integration, merchant API boundaries and Supabase application. Billing, widget and Shopify routes are present in the source tree.
- The public landing page at https://lenz.style returned HTTP 200 and supplies the cover image.
- The case study describes implementation and does not repeat the landing page's conversion metrics as measured project results.

## ZEDrift

- Owner's private repository: `CXBilen/zedrift`.
- README, `zedrift-client/src/App.tsx`, game modules and `zedrift-server/src/index.js` establish React/Three.js rendering, driving physics and Express/Socket.IO connections. Prisma and container configuration support the backend description.
- The public domain did not resolve during review. The case study presents the game project without a live availability claim.
- The cover is the existing `zedrift-client/public/maps/city_plan.png` asset, labeled as a city map.

## Badge presentation

The local Badge source matches the pinned COSS registry. The live COSS docs and this site both render default desktop badges at 18px height, 12px font and 3px horizontal padding. Project cards and case-study tags now use COSS's documented `lg` size: 22px height and 5px horizontal padding on desktop, 26px height on mobile. Their layout uses an 8px gap. The primitive source remains pinned and unchanged.
