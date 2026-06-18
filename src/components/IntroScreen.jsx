import { useState } from 'react';

export default function IntroScreen({ story, onComplete }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < story.length - 1) {
      setIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="screen intro-screen" onClick={handleNext}>
      <div className="stars-bg" />
      <div className="intro-content">
        <div className="intro-emoji">
          {index < 2 ? '😴' : index < 4 ? '😲' : '💪'}
        </div>
        <div className="dialog-bubble intro-bubble">
          <p className="dialog-text">{story[index]}</p>
        </div>
        <div className="intro-progress">
          {story.map((_, i) => (
            <span key={i} className={`dot ${i <= index ? 'active' : ''}`} />
          ))}
        </div>
        <p className="tap-hint">
          {index < story.length - 1 ? '탭하여 계속 ▶' : '탭하여 시작! 🚀'}
        </p>
      </div>
    </div>
  );
}
