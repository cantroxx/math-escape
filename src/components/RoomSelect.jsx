export default function RoomSelect({ rooms, unlocked, roomsState, difficulty, totalStars, onSelect, onChangeDifficulty, onReset }) {
  const maxStars = difficulty === 'hard' ? 40 : 20;

  return (
    <div className={`vn-screen difficulty-${difficulty}`}>
      <div className="vn-bg" style={{ backgroundImage: 'url(/images/select.jpg)' }} />
      <div className="vn-gradient full" />
      <div className="select-content">
        <div className="select-header">
          <h1 className="select-title">수학 던전</h1>
          <p className="select-sub">시련을 통과하고 탈출하라</p>

          <div className="difficulty-tabs">
            <button
              className={`diff-tab ${difficulty === 'normal' ? 'active' : ''}`}
              onClick={() => onChangeDifficulty('normal')}
            >
              보통
            </button>
            <button
              className={`diff-tab ${difficulty === 'hard' ? 'active' : ''}`}
              onClick={() => onChangeDifficulty('hard')}
            >
              어려움
            </button>
          </div>
        </div>

        <div className="select-grid">
          {rooms.map(r => {
            const open = unlocked.includes(r.id);
            const done = roomsState[r.id].cleared;
            const stars = roomsState[r.id].stars;
            return (
              <button key={r.id}
                className={`select-card ${open ? 'open' : 'locked'} ${done ? 'done' : ''}`}
                onClick={() => open && onSelect(r.id)}
                disabled={!open}>
                <div className="sc-img" style={{ backgroundImage: `url(${r.selectImg})` }} />
                <div className="sc-overlay" />
                <div className="sc-info">
                  {!open && <span className="sc-lock">잠김</span>}
                  <span className="sc-floor">{r.id}층</span>
                  <span className="sc-name">{r.name}</span>
                  <span className="sc-unit">{r.unit}</span>
                  {open && <span className={`sc-status ${done ? 'cleared' : ''}`}>
                    {done ? `통과 — ${stars}점` : '도전하기'}
                  </span>}
                </div>
              </button>
            );
          })}
        </div>

        <div className="select-footer">
          <span className="select-stars">총점: {totalStars} / {maxStars}</span>
          <button className="select-reset" onClick={onReset}>처음부터</button>
        </div>
      </div>
    </div>
  );
}
