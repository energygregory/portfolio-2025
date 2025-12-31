import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const LASTFM_ENDPOINT = "https://ws.audioscrobbler.com/2.0/";
const POLL_INTERVAL_MS = 20_000;

const getEnvVar = (key) => {
  const value = import.meta.env[key];
  if (!value || typeof value !== "string") return "";
  return value.trim();
};

const extractArtwork = (images = []) => {
  if (!Array.isArray(images) || !images.length) return null;
  const reversed = [...images].reverse();
  const withSrc = reversed.find((img) => typeof img?.["#text"] === "string" && img["#text"].trim());
  return withSrc ? withSrc["#text"].trim() : null;
};

const mapTrack = (entry) => {
  if (!entry) return null;
  const name = entry?.name?.trim();
  const artistValue = entry?.artist?.["#text"] ?? entry?.artist;
  const artist = typeof artistValue === "string" ? artistValue.trim() : "";
  const albumValue = entry?.album?.["#text"] ?? entry?.album;
  const album = typeof albumValue === "string" ? albumValue.trim() : "";
  const nowPlaying = entry?.["@attr"]?.nowplaying === "true";

  return {
    title: name || "Unknown track",
    artist: artist || "Unknown artist",
    album,
    songUrl: entry?.url || "https://open.spotify.com",
    artwork: extractArtwork(entry?.image),
    isPlaying: nowPlaying,
  };
};

const buildRequestUrl = (username, apiKey) => {
  if (!username || !apiKey) return null;
  const params = new URLSearchParams({
    method: "user.getrecenttracks",
    user: username,
    api_key: apiKey,
    limit: "1",
    format: "json",
  });
  return `${LASTFM_ENDPOINT}?${params.toString()}`;
};

export default function SpotifyNowPlaying({ theme = "dark" }) {
  const username = useMemo(() => getEnvVar("VITE_LASTFM_USERNAME"), []);
  const apiKey = useMemo(() => getEnvVar("VITE_LASTFM_API_KEY"), []);
  const canFetch = Boolean(username && apiKey);

  const requestUrl = useMemo(() => buildRequestUrl(username, apiKey), [username, apiKey]);

  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchTrack = useCallback(async () => {
    if (!requestUrl) {
      if (mountedRef.current) {
        setIsLoading(false);
      }
      return;
    }

    try {
      if (!mountedRef.current) return;
      setError(null);
      const response = await fetch(requestUrl, { headers: { "cache-control": "no-cache" } });
      if (!response.ok) {
        throw new Error(`Last.fm responded with ${response.status}`);
      }
      const payload = await response.json();
      const latest = payload?.recenttracks?.track?.[0];
      if (!mountedRef.current) return;
      setTrack(mapTrack(latest));
    } catch (err) {
      if (!mountedRef.current) return;
      setError("Unable to reach Last.fm right now");
    } finally {
      if (!mountedRef.current) return;
      setIsLoading(false);
    }
  }, [requestUrl]);

  useEffect(() => {
    if (!canFetch) return undefined;
    let intervalId;

    const run = async () => {
      await fetchTrack();
    };

    run();

    intervalId = window.setInterval(() => {
      run();
    }, POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [canFetch, fetchTrack]);

  if (!canFetch || !requestUrl) {
    return null;
  }

  const pillTheme =
    theme === "light"
      ? "bg-white/80 text-black border-black/10"
      : "bg-black/70 text-white border-white/10";

  const iconTheme = theme === "light" ? "bg-black text-white" : "bg-white text-black";

  const statusText = (() => {
    if (isLoading) return "Connecting";
    if (track?.isPlaying) return "Now Playing";
    if (track) return "Recently Played";
    if (error) return "Status";
    return "Idle";
  })();

  return (
    <div className="w-full flex justify-center">
      <div
        className={`spotify-pill relative flex items-center gap-3 px-4 py-2 rounded-full border ${pillTheme} backdrop-blur-md shadow-lg`}
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconTheme}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-5 h-5"
              aria-hidden="true"
              role="img"
            >
              <path d="M12 1.5C6.21 1.5 1.5 6.21 1.5 12S6.21 22.5 12 22.5 22.5 17.79 22.5 12 17.79 1.5 12 1.5zm4.82 15.39a.9.9 0 01-1.24.32 8.51 8.51 0 00-8.96 0 .9.9 0 11-.92-1.55 10.31 10.31 0 019.99 0 .9.9 0 01.32 1.23zm1.26-2.83a.99.99 0 01-1.36.34 11.77 11.77 0 00-12.09 0 .99.99 0 01-1-1.7 13.55 13.55 0 0114.09 0 .99.99 0 01.36 1.36zm.13-3.01a1.1 1.1 0 01-1.51.38 15.26 15.26 0 00-15.45 0 1.09 1.09 0 11-1.13-1.86 17.05 17.05 0 0117.71 0 1.09 1.09 0 01.38 1.48z" />
            </svg>
          </div>

          <div className="flex flex-col">
            <span className="text-xs uppercase opacity-60 tracking-widest">{statusText}</span>
            {error ? (
              <span className="text-sm font-semibold">{error}</span>
            ) : isLoading ? (
              <span className="text-sm font-semibold">Connecting…</span>
            ) : track ? (
              <a
                href={track.songUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold hover:underline"
              >
                {track.title}
              </a>
            ) : (
              <span className="text-sm font-semibold">Nothing queued</span>
            )}
            <span className="text-xs opacity-70">
              {track?.artist || (error ? "Last.fm" : "Waiting for scrobbles")}
            </span>
          </div>
        </div>

        {track?.artwork && (
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
            <img
              src={track.artwork}
              alt={track.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}
      </div>
    </div>
  );
}
