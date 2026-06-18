export default function EndingScreen({ ending, totalStars, roomStars, rooms, onReset }) {
  return (
    <div className="screen ending-screen">
      <div className="ending-content">
        <div className="ending-badge">{ending.title}</div>
        <div className="ending-trophy">🎓</div>
        <h1 className="ending-heading">마법학교 탈출 성공!</h1>
        <p className="ending-message">{ending.message}</p>

        <div className="ending-stats">
          <div className="total-stars-display">
            <span className="big-star">⭐</span>
            <span className="big-num">{totalStars}</span>
            <span className="big-denom">/ 28</span>
          </div>

          <div className="room-stats-grid">
            {rooms.map(room => (
              <div key={room.id} className="room-stat-item">
                <span className="room-stat-emoji">{room.emoji}</span>
                <span className="room-stat-name">{room.name}</span>
                <span className="room-stat-stars">⭐ {roomStars[room.id]}/7</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ending-story-box">
          <p>눈을 떠보니 자기 방 침대 위였다.</p>
          <p>시계를 보니 아직 시험 전날 밤.</p>
          <p>"꿈이었나…? 근데 수학이 좀 쉬워진 것 같은데?" 😄</p>
        </div>

        <div className="ending-actions">
          <button className="reset-btn ending-reset" onClick={onReset}>
            🔄 처음부터 다시 도전하기
          </button>
        </div>
      </div>
    </div>
  );
}
