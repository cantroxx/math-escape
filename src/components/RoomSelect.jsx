export default function RoomSelect({ rooms, gs, totalStars, onSelect, onReset }) {
  return (
    <div className="vn-screen">
      <div className="vn-bg" style={{ backgroundImage: 'url(/images/select.jpg)' }} />
      <div className="vn-gradient full" />
      <div className="select-content">
        <div className="select-header">
          <h1 className="select-title">수학 던전</h1>
          <p className="select-sub">시련을 통과하고 탈출하라</p>
        </div>

        <div className="select-grid">
          {rooms.map(r => {
            const open = gs.unlocked.includes(r.id);
            const done = gs.rooms[r.id].cleared;
            const stars = gs.rooms[r.id].stars;
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
          <span className="select-stars">총점: {totalStars} / 20</span>
          <button className="select-reset" onClick={onReset}>처음부터</button>
        </div>
      </div>
    </div>
  );
}
