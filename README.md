# Polymarket Soccer Analytics

Interactive analytics dashboard for Polymarket soccer events with determined outcomes.

## Features

- 3,521 soccer events with outcomes (68% of total closed events)
- $728M+ total trading volume
- Filter by tournament
- Search by event name or outcome
- Sort by volume (descending)
- Pagination (500 events per page)
- Dark theme inspired by tokenterminal.com
- Direct links to Polymarket event pages

## Data

Data collected from Polymarket API for 2025 soccer events (tag_id: 100350):
- Only closed events (closed=true)
- Events with determined outcomes (winners/draws)
- Excludes long-term bets and composite markets without standard outcomes

## Tech Stack

- React 18
- Vite
- TailwindCSS
- GitHub Pages

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
npm run deploy
```
