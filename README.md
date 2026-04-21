# GoStudent-Style Order Page (React + Vite)

A modern checkout/order page built with React functional components and Vite.

## Features

- Responsive mobile-first layout using CSS Grid and Flexbox
- Reusable UI components: `Form`, `InputField`, `OrderSummary`, `Button`
- Dynamic pricing logic through a custom hook (`usePricing`)
- Form validation with React Hook Form (required fields, email, phone)
- RTL/LTR direction toggle
- Country selector with flags via `react-country-flag`
- Fake backend with JSON Server:
  - `GET /pricing`
  - `POST /orders`
- Clean project structure (`components`, `hooks`, `services`, `data`, `styles`)
- Production build output ready to integrate into WordPress theme/plugin flow

## Project Structure

```bash
src/
  components/
  hooks/
  services/
  data/
  styles/
db.json
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run API + frontend together:

```bash
npm run dev:full
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

You can also run them separately:

```bash
npm run api
npm run dev
```

## Build for Production

```bash
npm run build
```

The production bundle will be generated in `dist/`.

## WordPress Integration Notes

- Copy the `dist/` assets into your WordPress theme/plugin static assets directory.
- Enqueue generated JS/CSS files using `wp_enqueue_script` and `wp_enqueue_style`.
- If needed, route API requests to a WordPress endpoint later by replacing `API_URL` in `src/services/api.js`.
