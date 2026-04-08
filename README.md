# Freelancer Studio

![Dashboard](./screenshot.png)

Freelancer Studio is a polished personal operations dashboard for independent professionals.
It combines client management, project tracking, and Kanban execution in one animated, responsive interface.

## Features

- Responsive dashboard optimized for desktop, tablet, and mobile layouts
- Animated stats, ticker, and page-level transitions
- Interactive Kanban board with drag-and-drop, inline add, and task detail drawer
- Command palette workflow (keyboard-first quick actions)
- Client and project management with detail pages
- Activity feed with persistent history
- Local persistence using browser storage
- Toast notifications and keyboard shortcuts
- Page-level error boundaries with crash recovery UI
- Reusable skeleton loading system across major surfaces

## Tech Stack

- React 18.2.0
- React DOM 18.2.0
- React Router DOM 6.22.0
- Framer Motion 11.0.0
- @hello-pangea/dnd 16.5.0
- @dnd-kit/core 6.3.1
- @dnd-kit/sortable 10.0.0
- @dnd-kit/utilities 3.2.2
- Vite 5.1.0
- Tailwind CSS 3.4.0
- PostCSS 8.4.0
- Autoprefixer 10.4.0

## Getting Started

```bash
npm install
npm run dev
```

## Project Structure

```text
.
├── ActivityChart.jsx
├── Analytics.jsx
├── App.jsx
├── ClientList.jsx
├── Clients.jsx
├── Cursor.jsx
├── Dashboard.jsx
├── globals.css
├── Header.jsx
├── index.html
├── KanbanBoard.jsx
├── main.jsx
├── package.json
├── postcss.config.js
├── Projects.jsx
├── README.md
├── RevenueCard.jsx
├── StatCard.jsx
├── store.js
├── tailwind.config.js
├── TaskCard.jsx
├── Ticker.jsx
├── useCounter.js
├── vite.config.js
└── src
	├── components
	│   ├── ActivityFeed.jsx
	│   ├── CommandPalette.jsx
	│   ├── ErrorBoundary.jsx
	│   ├── Skeleton.jsx
	│   └── Toast.jsx
	├── context
	│   ├── AppContext.jsx
	│   └── ToastContext.jsx
	├── hooks
	│   ├── useKeyboardShortcuts.js
	│   └── useLocalStorage.js
	└── pages
		├── ClientDetail.jsx
		├── Profile.jsx
		└── ProjectDetail.jsx
```

## Roadmap

- Add dark and light mode theme switching with user preference sync
- Integrate real authentication and profile accounts
- Add cloud sync and multi-device persistence
- Build native mobile companion app

## License

MIT
