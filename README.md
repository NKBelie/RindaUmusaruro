# RindaUmusaruro

**Smart Farming, Better Harvests** — a responsive agricultural productivity hackathon prototype for Rwanda.

## Run locally

Requires Node.js 20.19+ or 22.12+ and npm. No backend, database, or API keys are needed.

```sh
npm install --legacy-peer-deps
npm run dev
```

Open the Local URL printed by Vite. `npm run build` checks TypeScript and produces `dist/`. `npm run preview` serves that production build. `npm run typecheck` runs TypeScript alone. npm 10 may need `--legacy-peer-deps` to avoid an internal peer-resolution error.

## Explore the prototype

The homepage introduces the platform. Open **Login**, then choose **Farmer**, **Extension officer**, or **Administrator**. Demo roles do not need passwords. Registered local accounts use the password entered during registration (minimum 8 characters). Use fictional personal information and passwords.

- Farmer: farm CRUD, crop observations, photo preview, scenario assessments, weather, harvest plans, advice search, notifications, reports, profile, and settings.
- Officer: farmer directory, crop report review and responses, visit scheduling/history, farms, and advice.
- Administrator: account CRUD, farm records, crop reports, advisory publishing/removal, notifications, and local analytics.

## Three-minute judge demonstration

1. **0:00–0:25** — Introduce the problem on the homepage. Choose the Farmer demo.
2. **0:25–0:55** — Add a maize farm with an area, planting date, sample location, and expected harvest date.
3. **0:55–1:15** — Record a crop observation and flag it for officer review.
4. **1:15–1:45** — Open Disease Detection. Select that farm, choose a demo scenario, and upload a JPG, PNG, or WebP under 2 MB. Analyze and send the clearly labeled demonstration assessment to an officer.
5. **1:45–2:15** — Sign out, choose Extension officer, open Crop Reports, add advice, and resolve the assessment case.
6. **2:15–2:35** — Return to the Farmer demo. Open Notifications and read the officer response.
7. **2:35–3:00** — In Harvest Planning, choose the farm, enter planted area and yield per hectare, save the scenario, and show the production comparison.

All roles share browser-local demonstration records to support this journey. Settings lets you export records or reset the sample data. Data is scoped to the browser, not a production multi-user tenant system.

## Honest simulation boundaries

- **Demo Assessment – Not an AI Diagnosis:** an uploaded image is previewed and stored with a report. It is not analyzed. Results come from the scenario explicitly selected by the user. There is no model confidence score.
- **Weather:** static sample data, identical across selectable locations. Not a current forecast.
- **Harvest:** area in hectares × user-assumed tonnes per hectare. Not an agronomic forecast. Charts label illustrative trends and scenario results.
- **Authentication:** local storage only, with plaintext demo credentials. Password recovery is a local simulation; no SMS/email is sent. Do not use real credentials. No production security claim is made.
- **Locations:** representative sample provinces/districts/sectors, with free-text villages. Map markers show sample district centers, not field GPS or boundaries.
- **Advice:** general prototype educational content, not official RAB/MINAGRI guidance. No pesticide products or chemical dosages are recommended.
- **Language:** editable English/Kinyarwanda interface vocabulary, navigation, major headings, and selected farmer actions. Article summaries include Kinyarwanda. Specialist translation review is still needed; some supporting/admin copy remains English.
- **Connectivity:** external photography, Google fonts, and OpenStreetMap tiles need internet. Core local workflows run without service APIs after the app has loaded; this is not an installable/offline-cached PWA. System fonts remain available if web fonts fail.
- **Contact:** feedback is saved in local storage; nothing is sent to an external recipient.

## Architecture

```text
src/
  components/common/    Shared UI, accessible dialogs, lazy farm map
  components/layout/    Responsive application shell
  contexts/            Shared prototype state and session
  data/                Fictional fixtures, sample locations, advice
  hooks/               Browser-local persistence
  locales/             Editable Kinyarwanda vocabulary
  pages/public/        Landing page
  pages/auth/          Login, registration, local recovery
  pages/farmer/        Farmer tools and dashboards
  pages/officer/       Report review and field visits
  pages/admin/         Account management and analytics
  services/            Assessment scenarios and mock helpers
  types/               TypeScript domain interfaces
  App.tsx              React Router routes and role guards
```

React + TypeScript, Vite, Tailwind CSS, Lucide, Recharts, React Router, and Leaflet. The shared domain interfaces and mock service layer provide a starting point for future Spring Boot/PostgreSQL and Python model integrations. Real deployment would need backend authorization, secure authentication, ownership-scoped records, authoritative administrative data, validated agronomic content, storage/upload controls, reviewed translations, and real weather/model services.
