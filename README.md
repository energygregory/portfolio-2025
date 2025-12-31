# Portfolio Frontend

Vite + React frontend powering the portfolio site.

## Spotify "Now Playing" widget

The hero section can display the track currently playing on your Spotify account directly above the chrome logo. To enable it:

1. Deploy a tiny endpoint (serverless function, simple API route, etc.) that returns JSON with the keys `isPlaying`, `title`, `artist`, `albumArtUrl`, and `songUrl`. You can also forward the response from Spotify's `currently-playing` endpoint.
2. Copy `.env.example` to `.env` and set `VITE_SPOTIFY_NOW_PLAYING_URL` to that endpoint. Optionally adjust `VITE_SPOTIFY_POLL_INTERVAL` (milliseconds, default 45000).
3. Restart `npm run dev` so Vite picks up the new env vars.

When an endpoint isn't configured the widget is hidden in production and shows a reminder during local development.

## Development

```bash
npm install
npm run dev
```

The project uses plain CSS/Tailwind utility classes and React Router for navigation.
