
import { useState } from 'react';
import './Password.css';

const SECRET_PASSWORD = '22102003';

export default function PasswordPage({ onUnlock }) {
  const [password, setPassword] = useState('');
  const [hasError, setHasError] = useState(false);

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
    <div className="password-page">
      <div className="password-card">
        <div className="password-flower">🌻</div>

        <p className="password-eyebrow">
          A SECRET JUST FOR YOU
        </p>

        <h1>Hey, little sunshine ☀️</h1>

        <p className="password-description">
          Before you enter this little world,
          prove you're the right person.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setHasError(false);
            }}
            placeholder="Enter your secret password"
            aria-label="Secret password"
            autoComplete="off"
            required
          />

          {hasError && (
            <p className="password-error" role="alert">
              Wrong password! The butterflies are suspicious. 🦋
            </p>
          )}

          <button type="submit">
            Unlock my sunshine ✨
          </button>
        </form>

        <p className="password-footer">
          A tiny world made with lots of love 💛
        </p>
      </div>
    </div>
  );
}
