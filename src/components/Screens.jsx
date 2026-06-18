import { useState } from 'react';

function Intro({ story, onDone }) {
  const [i, setI] = useState(0);
  return (
    <div className="screen screen-intro" onClick={() => i < story.length - 1 ? setI(x => x + 1) : onDone()}>
      <div className="stars-bg" />
      <div className="intro-body">
        <div className="intro-emoji">{i < 2 ? '😴' : i < 4 ? '😲' : '💪'}</div>
        <div className="bubble"><p>{story[i]}</p></div>
        <div className="dots">{story.map((_, j) => <span key={j} className={`dot ${j <= i ? 'on' : ''}`} />)}</div>
        <div className="tap-hint">{i < story.length - 1 ? '탭하여 계속 ▶' : '탭하여 시작! 🚀'}</div>
      </div>
    </div>
  );
}

function RoomSelect({ rooms, gs, totalStars, onSelect, onReset }) {
  return (
    <div className="screen screen-rooms">
      <div className="rooms-header">
        <h1>🏰 수학 마법학교</h1>
        <div className="star-count">⭐ {totalStars} / 20</div>
      </div>
      <div className="rooms-grid">
        {rooms.map(r => {
          const open = gs.unlocked.includes(r.id);
          const done = gs.rooms[r.id].cleared;
          const stars = gs.rooms[r.id].stars;
          const itemCount = gs.rooms[r.id].items.length;
          return (
            <button
              key={r.id}
              className={`room-card ${open ? 'open' : 'locked'} ${done ? 'done' : ''}`}
              style={{ '--rc': r.color, '--ra': r.accent }}
              onClick={() => open && onSelect(r.id)}
              disabled={!open}
            >
              {!open && <div className="lock-icon">🔒</div>}
              <span className="room-emoji">{r.emoji}</span>
              <span className="room-num">제{r.id}관</span>
              <span className="room-name">{r.name}</span>
              <span className="room-unit">{r.unit}</span>
              {open && (
                <span className={`room-status ${done ? 'cleared' : ''}`}>
                  {done ? `✅ 클리어! ⭐${stars}` : `탐색 중…`}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <button className="btn-reset" onClick={onReset}>🔄 처음부터</button>
    </div>
  );
}

function Ending({ ending, totalStars, rooms, gs, onReset }) {
  return (
    <div className="screen screen-ending">
      <div className="ending-body">
        <div className="ending-badge">{ending.title}</div>
        <div className="ending-trophy">🎓</div>
        <h1>마법학교 탈출 성공!</h1>
        <p className="ending-msg">{ending.msg}</p>
        <div className="ending-stats">
          <div className="ending-total">
            <span className="et-icon">⭐</span>
            <span className="et-num">{totalStars}</span>
            <span className="et-den">/ 20</span>
          </div>
          <div className="ending-rooms">
            {rooms.map(r => (
              <div key={r.id} className="er-item">
                <span>{r.emoji}</span>
                <span className="er-name">{r.name}</span>
                <span className="er-stars">⭐ {gs.rooms[r.id].stars}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="ending-epilog">
          <p>눈을 떠보니 자기 방 침대 위였다.</p>
          <p>시계를 보니 아직 시험 전날 밤.</p>
          <p>"꿈이었나…? 근데 수학이 좀 쉬워진 것 같은데?" 😄</p>
        </div>
        <button className="btn-reset wide" onClick={onReset}>🔄 다시 도전하기</button>
      </div>
    </div>
  );
}

const Screens = { Intro, RoomSelect, Ending };
export default Screens;
