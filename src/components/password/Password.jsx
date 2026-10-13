
import { useState } from 'react';
import './Password.css';

const SECRET_PASSWORD = 'Y221003';

export default function PasswordPage({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (password.trim() === SECRET_PASSWORD) {
      setHasError(false);
      onUnlock();
    } else {
      setPassword('');
      setHasError(true);
    }
  };

  return (
    <main className="password-page">
      <div className="password-card">
        <div className="password-flower" aria-hidden="true">
          🌻
        </div>

        <p className="password-eyebrow">
          A SECRET JUST FOR YOU
        </p>

        <h1>Hey, little sunshine ☀️</h1>

        <p className="password-description">
          Before you enter this little world,
          prove you're the right person.
        </p>

        <form onSubmit={handleSubmit}>
          <label
            className="password-label"
            htmlFor="secret-password"
          >
            Your secret password
          </label>

          <input
            id="secret-password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setHasError(false);
            }}
            placeholder="Enter your password..."
            autoComplete="off"
            required
          />

          <button
            type="button"
            className="password-hint-button"
            onClick={() => setShowHint((previous) => !previous)}
            aria-expanded={showHint}
          >
            {showHint ? 'Hide hint 🙈' : 'Need a hint? 💛'}
          </button>

          {showHint && (
            <div className="password-hint">
              <span aria-hidden="true">🦋</span>
              <p>
                “Come on, Harry! You love yellow, don't you?
                <br/>
                🌻 Now think of the day the world got a little brighter… your secret is right there!”
                <br />
              </p>
            </div>
          )}

          {hasError && (
            <p className="password-error" role="alert">
              Oops! That's not the magic word.
              Try again, sunshine! 💛
            </p>
          )}

          <button type="submit" className="password-submit">
            Unlock my sunshine ✨
          </button>
        </form>

        <p className="password-footer">
          A tiny world made with lots of love 💛
        </p>

        <div className="password-decoration" aria-hidden="true">
          ✨ 🦋 ✨
        </div>
      </div>
    </main>
  );
}
