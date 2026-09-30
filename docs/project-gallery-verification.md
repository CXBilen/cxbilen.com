# Project gallery sources and verification

Reviewed and captured on 30 September 2026. The nine case studies contain 40 unique gallery images. The cover appears once in each gallery; its separate hero presentation links to the same original asset. Captions identify live interfaces, local prototypes, sample data and illustrations.

## Source classes

- **Live public:** screenshots taken through the current public product interface.
- **Live owner account:** screenshots of the owner's account. These show the visible account state, not a claim about commercial results.
- **Local application:** the existing application rendered locally without changing its interface to create a screenshot. Simulated integrations and unavailable backends remain identified.
- **Existing preview:** an existing interface screenshot from the project repository, retained with its preview or sample-data label.
- **Illustration:** a repository map asset or a source-based architecture diagram, identified as such.

## Gallery inventory

All asset names below are in `public/images/work/`. Counts include the cover once.

| Project | Images | Source and routes | Asset names |
| --- | ---: | --- | --- |
| Surfel | 5 | Live owner account: `https://app.surfel.io/o/cxbilen/sites` and `/o/cxbilen/settings/billing`. Three existing sample-data previews. | `surfel-sites-light.png`, `surfel-sites-dark.png`, `surfel-installation.png`, `surfel-live-sites.png`, `surfel-live-billing.png` |
| cxbilen.com | 5 | Local application: `http://localhost:3074/`, `/work`, `/cv`; same website source, desktop light/dark and 390 px mobile. | `portfolio-dark.png`, `portfolio-light.png`, `portfolio-mobile.png`, `portfolio-work.png`, `portfolio-cv.png` |
| Dev Migration Assistant | 4 | Existing previews from [the public repository](https://github.com/CXBilen/dev-migration-assistant), `docs/assets/screenshots/home.png`, `backup-projects.png`, `restore.png`, `diagnostics.png`. | `dev-migration-home.png`, `dev-migration-backup.png`, `dev-migration-restore.png`, `dev-migration-diagnostics.png` |
| PlayAgain | 4 | Live public: `https://www.playagain.app/`, `/host`, `/c/[room-code]?transport=ws`, and the host's built-in Demo Arena. | `playagain-01-canli-ana-sayfa.png`, `playagain-02-canli-host-lobi.png`, `playagain-03-canli-telefon-kumandasi.png`, `playagain-04-canli-demo-arena.png` |
| Looplift | 5 | Live owner account: `https://app.looplift.io/`, `/audits/[audit-id]`, `/experiments`. Existing public landing screenshot: `https://www.looplift.io/`. | `looplift-overview-dark.png`, `looplift-overview-light.png`, `looplift-audit-findings.png`, `looplift-experiments.png`, `looplift-home.png` |
| Maestro | 4 | Local application from repository revision `e98b6eb`: `http://localhost:4204/#how-it-works`, `/login`, desktop and mobile. Existing source-based architecture illustration. | `maestro-architecture.svg`, `maestro-workflow-desktop.png`, `maestro-login-dark.png`, `maestro-login-mobile.png` |
| SkyWise | 6 | Existing prototype screenshots and local application from [the public repository](https://github.com/CXBilen/skywise): `http://localhost:3075/chat` and `/trips`, native flight selection and trip management. | `skywise-chat.png`, `skywise-onboarding.png`, `skywise-import.png`, `skywise-flight-choice.png`, `skywise-flight-choice-mobile.png`, `skywise-trip-management.png` |
| LENZ | 3 | Live public: `https://lenz.style/`; its native “Try Free Demo Now” selection flow, product input on desktop and garment URL input on mobile. | `lenz-home-desktop.png`, `lenz-tryon-product-step.png`, `lenz-tryon-link-mobile.png` |
| ZEDrift | 4 | Local application from repository revision `a5d23ec`: `http://127.0.0.1:4203/`, login/signup mode and mobile login. Existing `zedrift-client/public/maps/city_plan.png` illustration. | `zedrift-city-plan.png`, `zedrift-login-desktop.png`, `zedrift-signup-desktop.png`, `zedrift-login-mobile.png` |

## Scope of the evidence

- Surfel's live account has an empty site list and an unavailable current plan. Earlier prototypes retain sample data; the activation and agent execution journey remains in development.
- Looplift's captured store has no running tests or shipped winners. Findings and experiment states are visible; the landing page's example is illustrative. No conversion uplift or statistically conclusive experiment is claimed.
- PlayAgain's phone was paired to the live room through WebSocket. The Demo Arena is the application's controller-input demo. A commercial game or ROM session was not used as screenshot evidence.
- Maestro's existing product and login interfaces rendered locally. No authenticated workspace or AI execution task was started; the architecture cover is a diagram. Unverified hero metrics and testimonials were excluded.
- SkyWise is an interactive prototype with sample flights and trips. Flight selection used the native chat flow for JFK to SFO. Booking, calendar, identity and assistant integrations are simulated.
- LENZ screenshots show the public website and selection steps. Image generation was not executed during capture, and landing page conversion metrics are not presented as measured results.
- ZEDrift's backend was offline during capture. Login/signup screens retain the connection state; the registration form was not submitted. The city map remains a labeled map asset, not a captured racing scene.
- Dev Migration Assistant's four images remain labeled as development previews. They illustrate the interface, rather than certifying a backup/restore run performed in this review.

## Presentation and checks

Screenshots were visually reviewed before selection. New local captures used separate headless browser sessions. Native controls and layout were preserved; no fabricated product data or UI was added to produce images. The personal website's development indicator was hidden through its native developer-tool preference.

The gallery keeps the existing responsive layout. Each thumbnail and hero cover is a keyboard-accessible link to its full-size original, opens in a new tab and has an accessible label and visible focus feedback. The renderer deduplicates cover paths and displays the source caption for every gallery image.

Validation completed on 30 September 2026:

- All nine case-study routes rendered at 1440 px and 390 px: 18 HTTP 200 responses, no horizontal overflow and no reported browser page errors.
- All 40 unique assets existed, returned HTTP 200 with an image content type, and had a source caption. The gallery counts matched the inventory above.
- Keyboard focus and Enter opened the original image in a new tab for desktop Looplift and mobile PlayAgain; the images decoded at their original dimensions.
- The personal website captures rendered all images in the expected themes. Its mobile capture is 390×844 and project overview is 1440×900.
- The existing suite passed: 20 test files, 40 tests. The production build passed compilation, type/lint checks and generation of 27 pages.
- `git diff --check` passed. CV source and exports, component primitives and the third-party license notice were unchanged in this gallery update.
