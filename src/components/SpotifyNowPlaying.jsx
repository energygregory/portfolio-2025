import React, { useState, useEffect } from 'react';

const SpotifyNowPlaying = ({ theme = 'dark' }) => {
  // --- CONFIGURATION ---
  const USERNAME = 'energygregory';
  const API_KEY = 'bd904e0fd30a90a8b49f857b9b01b900';
  // ---------------------

  const [musicData, setMusicData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMusic() {
      try {
        const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`;
        const response = await fetch(url, { headers: { 'cache-control': 'no-cache' } });
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const track = data?.recenttracks?.track?.[0];
        if (!track) throw new Error('No track data found');

        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const songName = track.name;
        const artistName = track.artist['#text'];
        const link = track.url;
        const imageSrc = (track.image?.[2]?.['#text']) || 'https://via.placeholder.com/64?text=Music';

        setMusicData({ isPlaying, songName, artistName, link, imageSrc });
        setError(null);
      } catch (err) {
        console.error('Music widget failed to load:', err);
        setError(err.message);
      }
    }

    loadMusic();
    const interval = setInterval(loadMusic, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fail silently: if error or loading, render nothing
  if (error || !musicData) return null;

  const { isPlaying, songName, artistName, link, imageSrc } = musicData;
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const subTextColor = theme === 'dark' ? '#888' : '#666';

  return (
    <div id="music-container" style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
      <img id="music-art" src={imageSrc} alt="Album Art" style={{ width: 50, height: 50, borderRadius: 4 }} />
      <div>
        <div id="music-status" style={{ fontSize: 10, color: isPlaying ? '#1DB954' : subTextColor, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
          {isPlaying ? 'Now Playing' : 'Recently Played'}
        </div>
        <a id="music-link" href={link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: textColor, fontWeight: 'bold' }}>
          <span id="music-song">{songName}</span>
        </a>
        <div id="music-artist" style={{ fontSize: 12, color: subTextColor }}>{artistName}</div>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;
import React, { useState, useEffect } from 'react';

const SpotifyNowPlaying = ({ theme = 'dark' }) => {
  // --- CONFIGURATION ---
  const USERNAME = "energygregory";
  const API_KEY = "bd904e0fd30a90a8b49f857b9b01b900";
  // ---------------------

  const [musicData, setMusicData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMusic() {
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`);
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        const track = data?.recenttracks?.track?.[0];
        if (!track) throw new Error('No track data found');

        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const songName = track.name;
        const artistName = track.artist['#text'];
        const url = track.url;
        const imageSrc = (track.image?.[2]?.['#text']) || 'https://via.placeholder.com/64?text=Music';

        setMusicData({ isPlaying, songName, artistName, url, imageSrc });
        setError(null);
      } catch (err) {
        console.error('Music widget failed to load:', err);
        setError(err.message);
      }
    }

    loadMusic();
    const interval = setInterval(loadMusic, 30000);
    return () => clearInterval(interval);
  }, []);

  // Fail silently: if error or loading, render nothing
  if (error || !musicData) return null;

  const { isPlaying, songName, artistName, url, imageSrc } = musicData;
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const subTextColor = theme === 'dark' ? '#888' : '#666';

  return (
    <div id="music-container" style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
      <img id="music-art" src={imageSrc} alt="Album Art" style={{ width: 50, height: 50, borderRadius: 4 }} />
      <div>
        <div id="music-status" style={{ fontSize: 10, color: isPlaying ? '#1DB954' : subTextColor, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 'bold' }}>
          {isPlaying ? 'Now Playing' : 'Recently Played'}
        </div>
        <a id="music-link" href={url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: textColor, fontWeight: 'bold' }}>
          <span id="music-song">{songName}</span>
        </a>
        <div id="music-artist" style={{ fontSize: 12, color: subTextColor }}>{artistName}</div>
      </div>
    </div>
  );
};

export default SpotifyNowPlaying;
import React, { useState, useEffect } from 'react';

const SpotifyNowPlaying = ({ theme = 'dark' }) => {
  // --- CONFIGURATION ---
  const USERNAME = "energygregory";
  const API_KEY = "bd904e0fd30a90a8b49f857b9b01b900";
  // ---------------------

  const [musicData, setMusicData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadMusic() {
      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USERNAME}&api_key=${API_KEY}&format=json&limit=1`);
        
        if (!response.ok) throw new Error('API Error');

        const data = await response.json();
        
        if (!data.recenttracks || !data.recenttracks.track || data.recenttracks.track.length === 0) {
          throw new Error('No track data found');
        }

        const track = data.recenttracks.track[0];

        const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';
        const songName = track.name;
        const artistName = track.artist['#text'];
        const url = track.url;
        const imageSrc = track.image[2]['#text'] || 'https://via.placeholder.com/64?text=Music';

        setMusicData({
          isPlaying,
          songName,
          export default SpotifyNowPlaying;
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
