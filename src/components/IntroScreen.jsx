import { useState } from 'react';

export default function IntroScreen({ scenes, onDone }) {
  const [idx, setIdx] = useState(0);
  const scene = scenes[idx];

  const handleTap = () => {
    if (idx < scenes.length - 1) setIdx(i => i + 1);
    else onDone();
  };

  return (
    <div className="vn-screen" onClick={handleTap}>
      <div className="vn-bg" style={{ backgroundImage: `url(${scene.img})` }} />
      <div className="vn-gradient" />
      <div className="vn-bottom">
        <div className="vn-text-box">
          <p className="vn-text">{scene.text}</p>
        </div>
        <div className="vn-nav">
          <span className="vn-dots">
            {scenes.map((_, i) => <span key={i} className={`vn-dot ${i <= idx ? 'on' : ''}`} />)}
          </span>
          <span className="vn-tap">{idx < scenes.length - 1 ? '탭하여 계속' : '탭하여 시작'}</span>
        </div>
      </div>
    </div>
  );
}
