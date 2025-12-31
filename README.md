# Portfolio Frontend

Vite + React frontend powering the portfolio site.

## Now Playing widget (Last.fm bridge)

The hero section can show whatever song you're listening to on Spotify by piggy-backing on Last.fm's scrobbling API (no custom backend needed):

1. Create or log into a free [Last.fm](https://www.last.fm) account.
2. In Last.fm ➝ **Settings** ➝ **Applications**, enable **Connect Spotify Scrobbling** so your plays sync automatically.
3. Create a Last.fm API key (Settings ➝ API ➝ "Create an API account"). Copy the generated key; you do **not** need the shared secret.
4. Copy `.env.example` to `.env` and set `VITE_LASTFM_USERNAME` and `VITE_LASTFM_API_KEY`. Optional: override `VITE_LASTFM_POLL_INTERVAL` (ms, min 5000) if you want faster updates.
5. Restart `npm run dev` so Vite picks up the environment variables.

When the credentials are missing the widget stays hidden in production (and shows a reminder locally).

## Development

```bash
npm install
npm run dev
```

The project uses plain CSS/Tailwind utility classes and React Router for navigation.
