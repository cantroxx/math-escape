import { useState } from 'react';

export default function EndingScreen({ scenes, ending, totalStars, rooms, gs, onReset }) {
  const [phase, setPhase] = useState('scene'); // scene → result
  const [idx, setIdx] = useState(0);

  if (phase === 'scene') {
    const scene = scenes[idx];
    const handleTap = () => {
      if (idx < scenes.length - 1) setIdx(i => i + 1);
      else setPhase('result');
    };
    return (
      <div className="vn-screen" onClick={handleTap}>
        <div className="vn-bg" style={{ backgroundImage: `url(${scene.img})` }} />
        <div className="vn-gradient" />
        <div className="vn-bottom">
          <div className="vn-text-box">
            <p className="vn-text">{scene.text}</p>
          </div>
          <span className="vn-tap">탭하여 계속</span>
        </div>
      </div>
    );
  }

  return (
    <div className="vn-screen">
      <div className="vn-bg" style={{ backgroundImage: 'url(/images/epilogue.jpg)' }} />
      <div className="vn-gradient full" />
      <div className="end-content">
        <h1 className="end-title">{ending.title}</h1>
        <p className="end-msg">{ending.msg}</p>
        <div className="end-stats">
          <div className="end-total">총점: <b>{totalStars}</b> / 20</div>
          <div className="end-rooms">
            {rooms.map(r => (
              <div key={r.id} className="end-room">
                <span className="er-floor">{r.id}층</span>
                <span className="er-name">{r.name}</span>
                <span className="er-score">{gs.rooms[r.id].stars}점</span>
              </div>
            ))}
          </div>
        </div>
        <p className="end-epilog">
          눈을 떠보니 학교 뒷산 벤치 위였다.
          {'\n'}동굴은 어디에도 보이지 않았다.
          {'\n\n'}"...꿈이었나? 근데 수학이 좀 쉬워진 것 같은데?"
        </p>
        <button className="vn-btn" onClick={onReset}>다시 도전하기</button>
      </div>
    </div>
  );
}
