export default function RoomSelect({ rooms, gameState, onSelect, onReset }) {
  const totalStars = Object.values(gameState.roomStars).reduce((a, b) => a + b, 0);
  const maxStars = 28;

  return (
    <div className="screen room-select-screen">
      <div className="room-select-header">
        <h1 className="room-select-title">🏰 수학 마법학교</h1>
        <div className="star-counter">⭐ {totalStars} / {maxStars}</div>
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => {
          const unlocked = gameState.unlockedRooms.includes(room.id);
          const cleared = gameState.roomCleared[room.id];
          const progress = gameState.roomProgress[room.id];
          const stars = gameState.roomStars[room.id];

          return (
            <button
              key={room.id}
              className={`room-card ${unlocked ? 'unlocked' : 'locked'} ${cleared ? 'cleared' : ''}`}
              style={{
                '--room-color': room.color,
                '--room-accent': room.accentColor,
              }}
              onClick={() => unlocked && onSelect(room.id)}
              disabled={!unlocked}
            >
              <div className="room-card-inner">
                {!unlocked && <div className="lock-overlay">🔒</div>}
                <span className="room-emoji">{room.emoji}</span>
                <span className="room-number">제{room.id}관</span>
                <span className="room-name">{room.name}</span>
                <span className="room-unit">{room.unit}</span>
                {unlocked && (
                  <div className="room-status">
                    {cleared ? (
                      <span className="room-cleared-badge">
                        ✅ 클리어! ⭐{stars}/7
                      </span>
                    ) : (
                      <span className="room-progress-text">
                        {progress}/7 진행 중
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button className="reset-btn" onClick={onReset}>
        🔄 처음부터 다시하기
      </button>
    </div>
  );
}
