
import { useEffect, useRef, useState } from 'react';
import './MusicPlayer.css';

const playlist = [
  {
    title: 'Our Little Sunshine',
    artist: 'A song just for you, Harry 💛',
    src: '/music/birthday-song.mp3',
  },
  {
    title: 'Our Special Song 🦋',
    artist: 'Another little memory for you',
    src: '/music/song-three.mp3',
  },
];

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
}

export default function MusicPlayer() {
  const audioRef = useRef(null);

  const [currentTrack, setCurrentTrack] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState('');
  const [shouldAutoPlay, setShouldAutoPlay] = useState(false);

  const track = playlist[currentTrack];

  // Load the selected song and resume playback when requested.
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.load();

    if (shouldAutoPlay) {
      audio
        .play()
        .then(() => {
          setError('');
        })
        .catch(() => {
          setIsPlaying(false);
          setError('Unable to play this song. Check the MP3 file.');
        })
        .finally(() => {
          setShouldAutoPlay(false);
        });
    }
  }, [currentTrack, shouldAutoPlay]);

  // Keep volume and mute settings synchronised with the audio element.
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.volume = volume;
    audio.muted = isMuted;
  }, [volume, isMuted]);

  // Play or pause the current song.
  async function togglePlayback() {
    const audio = audioRef.current;

    if (!audio) return;

    setError('');

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
        setError('Unable to play the song. Check the MP3 file.');
      }
    } else {
      audio.pause();
    }
  }

  // Select a track and optionally start playback.
  function changeTrack(index, autoplay = false) {
    if (index < 0 || index >= playlist.length) return;

    const audio = audioRef.current;

    if (!audio) return;

    const wasPlaying = !audio.paused;

    setError('');
    setCurrentTime(0);
    setDuration(0);

    // Selecting the current song restarts it.
    if (index === currentTrack) {
      audio.currentTime = 0;

      if (wasPlaying || autoplay) {
        audio.play().catch(() => {
          setIsPlaying(false);
          setError('Unable to play the song. Check the MP3 file.');
        });
      }

      return;
    }

    // Continue playback when switching tracks if needed.
    setShouldAutoPlay(wasPlaying || autoplay);
    setCurrentTrack(index);
  }

  // Seek to a selected position in the song.
  function handleSeek(event) {
    const audio = audioRef.current;

    if (!audio || !Number.isFinite(audio.duration)) return;

    const time = Number(event.target.value);

    audio.currentTime = time;
    setCurrentTime(time);
  }

  // Automatically advance when a song finishes.
  function handleEnded() {
    if (currentTrack < playlist.length - 1) {
      changeTrack(currentTrack + 1, true);
    } else {
      setIsPlaying(false);
      setCurrentTime(duration);
    }
  }

  return (
    <section className="music-card" id="music-player">
      <audio
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onTimeUpdate={(event) => {
          setCurrentTime(event.currentTarget.currentTime);
        }}
        onLoadedMetadata={(event) => {
          setDuration(event.currentTarget.duration);
        }}
        onDurationChange={(event) => {
          setDuration(event.currentTarget.duration || 0);
        }}
        onPlay={() => {
          setIsPlaying(true);
          setError('');
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        onEnded={handleEnded}
        onError={() => {
          setIsPlaying(false);
          setError(`Music file not found: ${track.src}`);
        }}
      />

      <div className="music-card-header">
        <div>
          <span className="music-kicker">
            A LITTLE MOMENT OF MAGIC
          </span>

          <h2>Our Little Playlist 💛</h2>

          <p>A melody to make you smile, Harry 🦋</p>
        </div>

        <div
          className={`music-sun-icon ${isPlaying ? 'is-playing' : ''}`}
        >
          ☀️
        </div>
      </div>

      <div className="music-card-content">
        <div
          className={`music-album-art ${isPlaying ? 'is-playing' : ''}`}
        >
          <span className="music-big-sun">☀️</span>
          <span className="music-butterfly">🦋</span>
          <span className="music-tiny-heart">♥</span>
        </div>

        <div className="music-player-details">
          <div className="music-track-info">
            <span className="music-now-playing">
              {isPlaying ? '♫ NOW PLAYING' : '♪ MADE FOR YOU'}
            </span>

            <h3>{track.title}</h3>
            <p>{track.artist}</p>
          </div>

          <div className="music-progress">
            <input
              type="range"
              aria-label="Song progress"
              min="0"
              max={duration || 1}
              step="0.1"
              value={Math.min(currentTime, duration || 1)}
              onChange={handleSeek}
              style={{
                '--progress': `${
                  duration ? (currentTime / duration) * 100 : 0
                }%`,
              }}
            />

            <div className="music-time">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="music-controls">
            <button
              type="button"
              className="music-skip-button"
              onClick={() => changeTrack(currentTrack - 1)}
              disabled={currentTrack === 0}
              aria-label="Previous song"
            >
              |◀
            </button>

            <button
              type="button"
              className="music-play-button"
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause music' : 'Play music'}
            >
              {isPlaying ? 'Ⅱ' : '▶'}
            </button>

            <button
              type="button"
              className="music-skip-button"
              onClick={() => changeTrack(currentTrack + 1)}
              disabled={currentTrack === playlist.length - 1}
              aria-label="Next song"
            >
              ▶|
            </button>
          </div>
        </div>
      </div>

      <div className="music-volume-row">
        <button
          type="button"
          className="music-mute-button"
          onClick={() => setIsMuted((previous) => !previous)}
          aria-label={isMuted ? 'Unmute music' : 'Mute music'}
        >
          {isMuted || volume === 0 ? '🔇' : '🔊'}
        </button>

        <input
          type="range"
          aria-label="Music volume"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
        />

        <span>🦋</span>
      </div>

      {error && (
        <p className="music-error" role="status">
          {error}
        </p>
      )}

      <div className="music-card-footer">
        <span>♡</span>
        Every song holds a little sunshine
        <span>♡</span>
      </div>
    </section>
  );
}
