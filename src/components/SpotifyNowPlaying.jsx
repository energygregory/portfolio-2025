import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const DEFAULT_POLL_INTERVAL = 45000;

const parseTrack = (payload) => {
  if (!payload) return null;
  const item = payload.item || payload.track || null;

  const title = payload.title || item?.name || null;
  const artist =
    payload.artist ||
    (item?.artists ? item.artists.map((artistEntry) => artistEntry.name).join(", ") : null);
  const albumArtUrl = payload.albumArtUrl || item?.album?.images?.[0]?.url || null;
  const songUrl = payload.songUrl || item?.external_urls?.spotify || payload.url || null;

  if (!title || !artist) {
    return null;
  }

  return {
    isPlaying: payload.isPlaying ?? payload.is_playing ?? false,
    title,
    artist,
    albumArtUrl,
    songUrl,
  };
};

export default function SpotifyNowPlaying({ theme = "dark" }) {
  const endpoint = useMemo(
    () => (import.meta.env.VITE_SPOTIFY_NOW_PLAYING_URL || "").trim(),
    []
  );
  const isDev = import.meta.env.DEV;
  const pollInterval = useMemo(() => {
    const raw = Number(import.meta.env.VITE_SPOTIFY_POLL_INTERVAL);
    if (Number.isFinite(raw) && raw > 5000) {
      return raw;
    }
    return DEFAULT_POLL_INTERVAL;
  }, []);

  const [track, setTrack] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchNowPlaying = useCallback(async () => {
    if (!endpoint) {
      setIsLoading(false);
      return;
    }

    try {
      if (!isMountedRef.current) return;
      setError(null);
      const response = await fetch(endpoint, {
        headers: {
          "cache-control": "no-cache",
        },
      });

      if (response.status === 204) {
        if (!isMountedRef.current) return;
        setTrack(null);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`Spotify responded with ${response.status}`);
      }

      const payload = await response.json();
      const parsedTrack = parseTrack(payload);
      if (!isMountedRef.current) return;
      setTrack(parsedTrack);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError("Unable to reach Spotify right now");
    } finally {
      if (!isMountedRef.current) return;
      setIsLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let isActive = true;

    const safeFetch = async () => {
      if (!isActive) return;
      await fetchNowPlaying();
    };

    safeFetch();

    if (!endpoint) {
      return () => {
        isActive = false;
      };
    }

    const intervalId = window.setInterval(() => {
      safeFetch();
    }, pollInterval);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
    };
  }, [endpoint, fetchNowPlaying, pollInterval]);

  if (!endpoint) {
    if (!isDev) {
      return null;
    }
    return (
      <div
        className={`spotify-pill text-xs sm:text-sm font-semibold tracking-wide px-4 py-2 rounded-full border ${{
          light: "bg-white/80 text-black border-black/10",
          dark: "bg-black/70 text-white border-white/10",
        }[theme]}`}
      >
        Configure Spotify to show what you're playing
      </div>
    );
  }

  const baseClasses =
    theme === "light"
      ? "bg-white/80 text-black border-black/10"
      : "bg-black/70 text-white border-white/10";

  return (
    <div
      className={`spotify-pill relative flex items-center gap-3 px-4 py-2 rounded-full border ${baseClasses} backdrop-blur-md shadow-lg`}
      aria-live="polite"
    >
      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
      <div className="flex items-center gap-3">
        {track?.albumArtUrl ? (
          <img
            src={track.albumArtUrl}
            alt="Album art"
            className="w-8 h-8 rounded-md object-cover border border-white/10"
            draggable={false}
          />
        ) : (
          <div className="w-8 h-8 rounded-md bg-white/10" aria-hidden="true" />
        )}
        <div className="flex flex-col leading-tight">
          <span className="text-xs uppercase opacity-60">Now Playing</span>
          {isLoading ? (
            <span className="text-sm font-semibold">Connecting…</span>
          ) : error ? (
            <span className="text-sm font-semibold">{error}</span>
          ) : track ? (
            <a
              href={track.songUrl || "https://open.spotify.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold hover:underline"
            >
              {track.title}
            </a>
          ) : (
            <span className="text-sm font-semibold">Paused</span>
          )}
          <span className="text-xs opacity-70">
            {track?.artist || (error ? "" : "Spotify")}
          </span>
        </div>
      </div>
    </div>
  );
}
