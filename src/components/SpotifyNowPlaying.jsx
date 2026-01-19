import React, { useState, useEffect } from 'react';

const SpotifyNowPlaying = ({ theme = 'dark' }) => {
  const [musicData, setMusicData] = useState(null);
  const [lastMusicData, setLastMusicData] = useState(null);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(0);

  useEffect(() => {
    async function loadMusic() {
      const now = Date.now();
      if (now - lastFetchTime < 30000) return; // Rate limit to 30 seconds
      setLastFetchTime(now);

      try {
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${import.meta.env.VITE_LASTFM_USERNAME}&api_key=${import.meta.env.VITE_LASTFM_API_KEY}&format=json&limit=1`);
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
        setLastMusicData({ isPlaying, songName, artistName, url, imageSrc });
        setError(null);
      } catch (err) {
        setError(err.message);
      }
    }

    loadMusic();
    const interval = setInterval(loadMusic, 30000);
    return () => clearInterval(interval);
  }, [lastFetchTime]);

  if (error && !lastMusicData) return null;

  const displayData = musicData || lastMusicData;
  if (!displayData) return null;

  const { isPlaying, songName, artistName, url, imageSrc } = displayData;
  const textColor = theme === 'dark' ? '#ffffff' : '#000000';
  const subTextColor = theme === 'dark' ? '#888' : '#666';

  return (
    <div id="music-container" style={{ fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', gap: 10, whiteSpace: 'nowrap' }}>
      <img id="music-art" src={imageSrc} alt="Album Art" style={{ width: 50, height: 50, borderRadius: 4, flexShrink: 0 }} crossOrigin="anonymous" />
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
