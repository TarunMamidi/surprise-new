
import { useState } from 'react';
import './SpinWheel.css';

const roasts = [
  {
    emoji: '🍜',
    title: 'FOOD IS HER PERSONALITY',
    short: 'Food Queen',
    message:
      'Ask Harry what she wants to eat. She says “anything” and rejects every option. GIRL, YOU PICKED THE QUESTION. 😭',
    comeback: 'The menu has filed a complaint.',
  },
  {
    emoji: '🤡',
    title: 'PROFESSIONAL OVERTHINKER',
    short: 'Overthinker',
    message:
      'One tiny message. Forty-seven imaginary scenarios. Three emotional breakdowns. The other person was literally just busy. 💀',
    comeback: 'Her brain needs a day off.',
  },
  {
    emoji: '👑',
    title: 'MAIN CHARACTER SYNDROME',
    short: 'Main Character',
    message:
      'Every walk is a runway. Every inconvenience is a plot twist. Everyone else is apparently a supporting character. 😂',
    comeback: 'Netflix is not ready.',
  },
  {
    emoji: '😤',
    title: 'ANGRY FOR NO REASON',
    short: 'Miss Attitude',
    message:
      '“I’m fine.” The temperature in the room drops by 15 degrees. Everyone starts apologising. Nobody knows why. 😭',
    comeback: 'Weather forecast: 100% attitude.',
  },
  {
    emoji: '☕',
    title: 'PRET COFFEE ADDICT',
    short: 'Coffee Addict',
    message:
      'Her bank account says save money. Her heart says Pret. Guess which one wins every single time. ☕💸',
    comeback: 'Financial advisor: absolutely not.',
  },
  {
    emoji: '🙄',
    title: 'DRAMA QUEEN SUPREME',
    short: 'Drama Queen',
    message:
      'A minor inconvenience happens and suddenly it’s the season finale, the plot twist, AND the emotional climax. Oscar when? 🎬',
    comeback: 'And the award goes to… HARRY!',
  },
  {
    emoji: '🫠',
    title: 'DELULU DEPARTMENT MANAGER',
    short: 'Certified Delulu',
    message:
      'Reality called. Harry declined the call, put her phone on silent, and continued living in her own cinematic universe. 💅',
    comeback: 'Delusion is a full-time job.',
  },
  {
    emoji: '🎯',
    title: 'THE FINAL BOSS: YOUR TURN!',
    short: 'Reverse Roast',
    message:
      'PLOT TWIST! Harry gets to roast YOU now! Hand over the phone and prepare to have your entire personality reviewed. No appeals, no refunds, no mercy. 💀😂',
    comeback: 'THE TABLES HAVE TURNED. Harry wins!',
  },
];

const REVERSE_ROAST_INDEX = roasts.length - 1;
const NORMAL_ROAST_COUNT = roasts.length - 1;
const SEGMENT_ANGLE = 360 / roasts.length;

export default function SpinWheel() {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState([]);
  const [pendingResult, setPendingResult] = useState(null);

  const completed = revealed.length === roasts.length;
  const reverseRoastUnlocked = revealed.length === NORMAL_ROAST_COUNT;

  const spinWheel = () => {
    if (spinning || completed) return;

    // Choose randomly from normal roasts that haven't appeared yet.
    const remaining = roasts
      .slice(0, NORMAL_ROAST_COUNT)
      .map((_, index) => index)
      .filter((index) => !revealed.includes(index));

    // The reverse roast is guaranteed to be the final spin.
    const nextIndex = remaining.length === 0
      ? REVERSE_ROAST_INDEX
      : remaining[Math.floor(Math.random() * remaining.length)];

    // Align the selected segment with the pointer at the top.
    const currentAngle = ((rotation % 360) + 360) % 360;
    const segmentCenter = nextIndex * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
    const targetAngle = (360 - segmentCenter + 360) % 360;
    const extraAngle = (targetAngle - currentAngle + 360) % 360;

    setSelected(null);
    setPendingResult(nextIndex);
    setSpinning(true);

    // Six full turns, followed by the randomly selected segment.
    setRotation((previous) => previous + 360 * 6 + extraAngle);
  };

  const handleWheelStop = (event) => {
    if (
      event.propertyName !== 'transform' ||
      !spinning ||
      pendingResult === null
    ) {
      return;
    }

    setSelected(pendingResult);
    setRevealed((previous) =>
      previous.includes(pendingResult)
        ? previous
        : [...previous, pendingResult]
    );
    setPendingResult(null);
    setSpinning(false);
  };

  const progress = revealed.length;
  const nextIsFinal = reverseRoastUnlocked && !completed;

  return (
    <section className="rage-bite-section" id="rage-bite">
      <div className="rage-bite-header">
        <span className="rage-bite-kicker">
          ⚠️ BEST FRIEND ROAST ZONE ⚠️
        </span>

        <h2>
          RAGE <span>BITE</span> 🎡
        </h2>

        <p className="rage-bite-subtitle">
          Harry vs. the truth. Let the wheel decide. 😭
        </p>

        <p className="rage-bite-warning">
          Warning: dangerously accurate. Don't fight the wheel.
        </p>
      </div>

      <div className="rage-bite-game">
        <div className="rage-progress">
          <span>ROASTS UNLOCKED</span>
          <strong>{progress} / {roasts.length}</strong>
        </div>

        <div
          className="rage-progress-track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={roasts.length}
          aria-valuenow={progress}
          aria-label="Roasts discovered"
        >
          <div
            className="rage-progress-fill"
            style={{ width: `${(progress / roasts.length) * 100}%` }}
          />
        </div>

        <div className="rage-bite-pointer" aria-hidden="true">
          ▼
        </div>

        <div className="rage-wheel-frame">
          <div
            className="rage-wheel"
            style={{ transform: `rotate(${rotation}deg)` }}
            onTransitionEnd={handleWheelStop}
            role="img"
            aria-label="Random roast wheel"
          >
            {roasts.map((roast, index) => {
              const angle = index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2;
              const alreadyRevealed = revealed.includes(index);

              return (
                <div
                  className={`rage-wheel-label ${
                    alreadyRevealed ? 'rage-wheel-label-revealed' : ''
                  }`}
                  key={roast.short}
                  style={{
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--label-radius))) rotate(-${angle}deg)`,
                  }}
                >
                  <span>{alreadyRevealed ? '✅' : roast.emoji}</span>
                  <small>{alreadyRevealed ? 'REVEALED!' : roast.short}</small>
                </div>
              );
            })}
          </div>

          <div className="rage-wheel-center" aria-hidden="true">
            🔥
          </div>
        </div>

        <p className="rage-wheel-instruction">
          {completed
            ? 'ALL ROASTS UNLOCKED. HARRY WINS! 👑'
            : nextIsFinal
              ? 'THE FINAL BOSS IS READY… 🎯'
              : 'Spin to reveal a NEW roast. No repeats! 😂'}
        </p>

        <button
          type="button"
          className="rage-spin-button"
          onClick={spinWheel}
          disabled={spinning || completed}
        >
          {spinning
            ? 'EXPOSING HARRY… 💀'
            : completed
              ? 'CHALLENGE COMPLETED! 🏆'
              : nextIsFinal
                ? 'UNLOCK THE REVERSE ROAST! 🎯'
                : 'SPIN FOR THE NEXT ROAST 🎡'}
        </button>

        {selected !== null && (
          <div className="rage-result" aria-live="polite" key={selected}>
            <div className="rage-result-emoji">
              {roasts[selected].emoji}
            </div>

            <span className="rage-result-label">
              {selected === REVERSE_ROAST_INDEX
                ? '🎉 THE FINAL ROAST'
                : `ROAST ${progress} OF ${roasts.length}`}
            </span>

            <h3>{roasts[selected].title}</h3>

            <p className="rage-result-message">
              {roasts[selected].message}
            </p>

            <div className="rage-comeback">
              💬 {roasts[selected].comeback}
            </div>

            {selected === REVERSE_ROAST_INDEX ? (
              <p className="rage-result-footer">
                You survived all the roasts! Now Harry gets the last laugh. 💛
              </p>
            ) : (
              <p className="rage-result-footer">
                {NORMAL_ROAST_COUNT - revealed.filter(
                  (index) => index !== REVERSE_ROAST_INDEX
                ).length === 0
                  ? 'One last surprise remains… 👀'
                  : `${NORMAL_ROAST_COUNT - revealed.filter(
                      (index) => index !== REVERSE_ROAST_INDEX
                    ).length} normal roast(s) left before the final reverse roast!`}
              </p>
            )}

            {!completed && (
              <button
                type="button"
                className="rage-again-button"
                onClick={spinWheel}
                disabled={spinning}
              >
                {nextIsFinal
                  ? 'SPIN FOR THE FINAL ROAST 🎯'
                  : 'SPIN AGAIN, COWARD 😂'}
              </button>
            )}

            {completed && (
              <button
                type="button"
                className="rage-again-button"
                onClick={() => {
                  setRotation(0);
                  setSpinning(false);
                  setSelected(null);
                  setRevealed([]);
                  setPendingResult(null);
                }}
              >
                PLAY AGAIN FROM THE START 🔄
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
