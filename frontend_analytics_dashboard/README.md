# Analytics Dashboard (Frontend)

A modern, minimal, light-themed web analytics dashboard built with React. It uses mocked data for traffic, devices, browsers, geography, and top pages, with a simple real-time feel.

## Features

- Real-time traffic chart (mocked, updates on interval)
- KPI cards for active visitors, averages, time and bounce
- Device and browser breakdown (donut charts + legend)
- Geography (bar chart)
- Top pages table
- Sidebar navigation and sticky header
- Date range selection (presets + custom)
- Light theme with provided brand colors
- Environment-configurable settings

## Quick start

```bash
npm install
npm start
```

Open http://localhost:3000

## Environment variables

Create a `.env` (or use your CI/CD env) with the following optional variables:

```
REACT_APP_SITE_NAME=My Website
REACT_APP_API_BASE_URL=
REACT_APP_WEBSOCKET_URL=
REACT_APP_REFRESH_MS=2000
```

These are read by the app to configure labels and the refresh interval for mocked real-time updates.

## Scripts

- `npm start` - Start dev server
- `npm test` - Run tests
- `npm run build` - Production build

## Notes

- The app uses a lightweight canvas-based chart implementation to avoid large dependencies.
- All analytics are mocked; connect to real APIs by replacing the generators in `src/utils/mockData.js`.
