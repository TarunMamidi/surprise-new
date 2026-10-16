
import React, { useState } from "react";
import "./CalmCorner.css";

const notes = [
  {
    title: "For a difficult day",
    subtitle: "A little comfort",
    emoji: "☁️",
    message:
      "Hey, sunshine. You don't have to solve everything today. Take things one little step at a time. It's okay to pause, and it's okay to ask for support. You deserve kindness, especially from yourself."
  },
  {
    title: "When you need a laugh",
    subtitle: "A happy memory",
    emoji: "😂",
    message:
      "Emergency sunshine delivery! ☀️ Remember our food adventures, random conversations, and all the little moments that make our friendship ours. I hope something makes you laugh today. And if not, I reserve the right to annoy you until you do."
  },
  {
    title: "When life feels heavy",
    subtitle: "Take it slowly",
    emoji: "🦋",
    message:
      "You don't have to figure everything out at once. Pick one small thing, or take a break before doing anything at all. You are more than your to-do list. Be gentle with yourself, little sunshine."
  },
  {
    title: "A reminder for you",
    subtitle: "You're appreciated",
    emoji: "🌻",
    message:
      "You matter beyond what you achieve, how productive you are, or how well your day goes. I'm grateful for the memories we share, and I hope you remember to give yourself some of the kindness you give others. You'll always have a little sunshine here."
  },
  {
    title: "When you can't sleep",
    subtitle: "A gentle goodnight",
    emoji: "🌙",
    message:
      "Let today be finished for now. You can return to tomorrow's worries tomorrow. Get comfortable, loosen your shoulders, and let yourself rest without needing to earn it. Sending you a little sunshine, even on the quietest nights."
  }
];

export default function CalmCorner() {
  const [openedNote, setOpenedNote] = useState(null);

  return (
    <section className="calm-corner" id="calm-corner">
      <header className="letter-wall-heading">
        <span className="letter-wall-eyebrow">
          A LITTLE SOMETHING FOR YOU
        </span>

        <h2>Open When You Need It 💌</h2>

        <p>
          For the sunny days, the cloudy days, and every
          little day in between. Pick whichever note feels
          right for you, sunshine.
        </p>
      </header>

      <div className="letter-wall">
        {notes.map((note, index) => {
          const isOpen = openedNote === index;

          return (
            <article
              className={`letter-tile letter-tile-${index + 1} ${
                isOpen ? "letter-tile-open" : ""
              }`}
              key={note.title}
            >
              {!isOpen ? (
                <button
                  className="envelope-front"
                  type="button"
                  onClick={() => setOpenedNote(index)}
                  aria-label={`Open letter: ${note.title}`}
                >
                  <span className="envelope-decoration">
                    {note.emoji}
                  </span>

                  <span className="envelope-title">
                    {note.title}
                  </span>

                  <span className="envelope-subtitle">
                    {note.subtitle}
                  </span>

                  <span className="envelope-seal">
                    ✉
                  </span>

                  <span className="envelope-hint">
                    Tap to open
                  </span>
                </button>
              ) : (
                <div className="letter-inside">
                  <span className="letter-inside-emoji">
                    {note.emoji}
                  </span>

                  <h3>{note.title}</h3>

                  <p>{note.message}</p>

                  <span className="letter-signoff">
                    A little sunshine, just for you ☀️
                  </span>

                  <button
                    className="letter-close"
                    type="button"
                    onClick={() => setOpenedNote(null)}
                  >
                    Fold the letter ✉
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      <p className="letter-wall-footer">
        No rush, no expectations. Just a little reminder
        that someone is glad you're in their world. 💛
      </p>
    </section>
  );
}
