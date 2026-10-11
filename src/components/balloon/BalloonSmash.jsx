
import { useEffect, useState } from 'react';
import './BalloonSmash.css';

export default function BalloonSmash() {
  const [active, setActive] = useState(false);
  const [popped, setPopped] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (!active) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setActive(false);
        setPopped(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  const openSurprise = () => {
    setPopped(false);
    setRound((previous) => previous + 1);
    setActive(true);
  };

  const closeSurprise = () => {
    setActive(false);
    setPopped(false);
  };

  const popBalloon = () => {
    setPopped(true);
  };

  return (
    <>
      {/* Small floating launcher */}
      <button
        type="button"
        className="balloon-launcher"
        onClick={openSurprise}
        aria-label="Open birthday balloon surprise"
        title="A little surprise for Harry"
      >
        🎈
        <span className="balloon-launcher-sparkle">✦</span>
      </button>

      {/* Render the overlay only when opened */}
      {active && (
        <div
          className="balloon-overlay"
          onClick={closeSurprise}
        >
          <button
            type="button"
            className="balloon-close"
            onClick={closeSurprise}
            aria-label="Close surprise"
          >
            ×
          </button>

          <section
            key={round}
            className="balloon-scene"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Harry's birthday surprise"
          >
            {!popped ? (
              <>
                <div className="balloon-decorations" aria-hidden="true">
                  🌻 ✨ 🦋
                </div>

                <p className="balloon-eyebrow">
                  A LITTLE SURPRISE FOR YOU
                </p>

                <h2 className="balloon-heading">
                  Hey, Harry! 💛
                </h2>

                <p className="balloon-instruction">
                  Tap the balloon to make a little birthday magic.
                </p>

                <button
                  type="button"
                  className="birthday-balloon"
                  onClick={popBalloon}
                  aria-label="Pop the birthday balloon"
                >
                  🎈
                </button>

                <p className="balloon-tap-hint">
                  TAP TO POP ✨
                </p>
              </>
            ) : (
              <div className="balloon-result">
                <div className="balloon-confetti" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, index) => (
                    <span
                      key={index}
                      style={{
                        '--i': index,
                        '--angle': `${index * 15}deg`,
                      }}
                    >
                      {['💛', '✨', '🎉', '🦋', '🌻'][index % 5]}
                    </span>
                  ))}
                </div>

                <div className="popped-icon" aria-hidden="true">
                  🎊
                </div>

                <p className="balloon-eyebrow">
                  TODAY IS ALL ABOUT YOU
                </p>

                <h1 className="birthday-message">
                  HBD
                  <br />
                  <span>HARRY!</span>
                </h1>

                <p className="birthday-wish">
                  Keep smiling, keep exploring, and keep being
                  your wonderful self. You deserve all the
                  sunshine in the world! 💛
                </p>

                <p className="birthday-signature">
                  You’ll always be my little sunshine. 🌻
                </p>

                <div className="balloon-actions">
                  <button
                    type="button"
                    className="balloon-replay"
                    onClick={openSurprise}
                  >
                    Again? 🎈
                  </button>

                  <button
                    type="button"
                    className="balloon-done"
                    onClick={closeSurprise}
                  >
                    Back to our memories
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
