# 🎫 EventHub | Full-Stack Event Orchestration Platform

**EventHub** is a robust, real-time event management system designed for seamless digital ticketing and attendee engagement. Built on a high-performance Vite architecture, it integrates secure authentication, dynamic QR code generation, and professional-grade data state management.

## 🚀 The Tech Stack
* **Frontend:** React 18 + Vite 6 (Ultra-fast HMR)
* **State Management:** TanStack Query v5 (Professional data caching & synchronization)
* **Backend & Auth:** Supabase (PostgreSQL + Supabase Auth UI)
* **Utilities:** `html5-qrcode` for live scanning and `canvas-confetti` for gamified user UX.
* **Data Visualization:** Recharts for event attendance and registration analytics.
* **Validation:** Zod + React Hook Form.

## 🧠 Key Features
* **Synchronized Data Layer:** Leverages TanStack Query to ensure event schedules and attendee lists remain consistent without manual refreshes.
* **Digital Access Control:** Integrated QR code generation and scanning engine for instant, on-site check-ins.
* **Secure Auth Flow:** A complete authentication ecosystem using Supabase, supporting secure user sessions and protected event routes.
* **Exportable Assets:** Utilizes `html2canvas` to allow users to generate and download event passes or certificates directly from the browser.

## 🛠️ Technical Architecture
EventHub is built as a **Modular Vite Monolith**. By utilizing `@vitejs/plugin-react-swc`, the application maintains lightning-fast compilation times while handling complex third-party library integrations. The UI is strictly type-safe via TypeScript 5.5, ensuring reliability in high-stakes event environments.

---
*Built with precision and AI-Augmented Logic by kayz*
