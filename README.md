# GoStudent-Style Order Page (React + Vite)

A premium, highly interactive checkout/order page built with React functional components and Vite. It is designed to be embedded in a WordPress site as a plugin/shortcode while maintaining an independent modern development workflow.

## Features Added

*   **Premium Visual Design:** Glassmorphism (`backdrop-filter`), smooth micro-interactions, CSS custom properties design system, animated background gradients, and Skeleton loading states.
*   **True RTL Support:** Fully implemented using CSS Logical Properties (`margin-inline-start`, etc.) rather than just a text direction toggle. Works flawlessly in Arabic (`ar-SA`).
*   **WordPress Integration Ready:** Includes a `wordpress` folder with a plugin file (`gostudent-order.php`) that enqueues the compiled Vite assets and registers REST API endpoints.
*   **Mock API with Fallback:** If `json-server` or the WP REST API is unreachable, the app seamlessly falls back to inline mock data so the demo never breaks. Includes simulated network latency.
*   **Form Validation UX Enhancements:** Inline success indicators, shaking animation on errors, and improved accessibility attributes.
*   **Responsive & Cross-Browser:** Mobile-first approach with fluid typography and breakpoints for tablet/desktop. CSS prefixes applied.

## Setup for Development

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run Dev Server + JSON Server mock API:**
    ```bash
    npm run dev:full
    ```
    This concurrently runs the Vite frontend on `http://localhost:5173` and the JSON-server on `http://localhost:3001`.

## Build for Production / WordPress

1.  **Build the app:**
    ```bash
    npm run build
    ```
2.  **Deploy to WordPress:**
    *   Copy the entire `Front-End-Developer-Test-` folder (or at least the `dist` folder and `wordpress/gostudent-order.php`) into your `wp-content/plugins/` directory.
    *   Activate the "GoStudent Order Page" plugin in the WordPress admin.
    *   Add the shortcode `[gostudent_order]` to any WordPress page.
    *   The React app will automatically use the WordPress REST API nonce and endpoints provided by `gostudent-order.php`.

## Tech Stack
*   **Framework:** React 19 + Vite 8
*   **Form Handling:** React Hook Form
*   **Styling:** Pure CSS3 (Logical Properties, Flexbox, Grid, Variables)
*   **Icons/Assets:** Inline SVGs, `react-country-flag`
