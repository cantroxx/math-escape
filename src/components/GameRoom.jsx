import { useState, useEffect } from 'react';

function NPCDialog({ room, lines, onComplete }) {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index < lines.length - 1) {
      setIndex(i => i + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="npc-dialog-overlay" onClick={handleNext}>
      <div className="npc-area">
        <div className="npc-avatar" style={{ '--glow': room.accentColor }}>
          {room.npcEmoji}
        </div>
        <span className="npc-name">{room.npc}</span>
      </div>
      <div className="dialog-bubble" style={{ '--accent': room.accentColor }}>
        <p className="dialog-text">{lines[index]}</p>
      </div>
      <div className="dialog-footer">
        <div className="dialog-dots">
          {lines.map((_, i) => (
            <span key={i} className={`dot ${i <= index ? 'active' : ''}`} />
          ))}
        </div>
        <p className="tap-hint">
          {index < lines.length - 1 ? '탭하여 계속 ▶' : '탭하여 시작! 🚀'}
        </p>
      </div>
    </div>
  );
}

function QuestionView({ room, question, qIndex, total, stars, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  useEffect(() => {
    setSelected(null);
    setShowResult(false);
    setShowHint(false);
    setUsedHint(false);
  }, [question.id]);

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setShowResult(true);
  };

  const handleNext = () => {
    const isCorrect = selected === question.answer;
    if (isCorrect) {
      onAnswer(true, usedHint);
    } else {
      setSelected(null);
      setShowResult(false);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setUsedHint(true);
  };

  const isCorrect = selected === question.answer;

  return (
    <div className="question-view">
      <div className="question-header">
        <div className="question-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(qIndex / total) * 100}%`,
                background: room.accentColor
              }}
            />
          </div>
          <span className="progress-text">
            {qIndex + 1} / {total}
          </span>
        </div>
        <div className="star-display">⭐ {stars}</div>
      </div>

      <div className="question-card" style={{ '--accent': room.accentColor }}>
        <div className="question-number">Q{qIndex + 1}</div>
        <p className="question-text">{question.question}</p>

        <div className="choices-list">
          {question.choices.map((choice, idx) => {
            let cls = 'choice-btn';
            if (selected === idx) cls += ' selected';
            if (showResult) {
              if (idx === question.answer) cls += ' correct';
              else if (idx === selected && !isCorrect) cls += ' wrong';
            }
            return (
              <button
                key={idx}
                className={cls}
                onClick={() => handleSelect(idx)}
                disabled={showResult}
              >
                <span className="choice-marker">
                  {['①', '②', '③', '④'][idx]}
                </span>
                <span className="choice-text">{choice}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`result-box ${isCorrect ? 'correct' : 'wrong'}`}>
            {isCorrect ? (
              <>
                <span className="result-emoji">🎉</span>
                <p className="result-msg">정답이에요!</p>
                {!usedHint && <p className="result-star">⭐ +1</p>}
              </>
            ) : (
              <>
                <span className="result-emoji">😅</span>
                <p className="result-msg">아쉬워요! 다시 도전해봐요!</p>
              </>
            )}
            <p className="explanation">{question.explanation}</p>
          </div>
        )}

        {showHint && !showResult && (
          <div className="hint-box">
            <p>{room.hint}</p>
          </div>
        )}
      </div>

      <div className="question-actions">
        {!showResult ? (
          <>
            {!showHint && (
              <button className="hint-btn" onClick={handleHint}>
                💡 힌트 보기
              </button>
            )}
            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={selected === null}
              style={{ background: room.accentColor }}
            >
              정답 확인
            </button>
          </>
        ) : (
          <button
            className="next-btn"
            onClick={handleNext}
            style={{ background: room.accentColor }}
          >
            {isCorrect ? '다음 문제 ▶' : '다시 풀기 🔄'}
          </button>
        )}
      </div>
    </div>
  );
}

function RoomClearView({ room, stars, onContinue }) {
  return (
    <div className="room-clear-overlay">
      <div className="clear-card">
        <div className="clear-emoji">🔑</div>
        <h2 className="clear-title">열쇠 획득!</h2>
        <p className="clear-room">{room.emoji} {room.name} 클리어!</p>
        <div className="clear-stars">
          {[...Array(7)].map((_, i) => (
            <span key={i} className={`clear-star ${i < stars ? 'earned' : ''}`}>
              {i < stars ? '⭐' : '☆'}
            </span>
          ))}
        </div>
        <p className="clear-score">{stars} / 7 ⭐</p>

        <div className="npc-area small">
          <div className="npc-avatar small" style={{ '--glow': room.accentColor }}>
            {room.npcEmoji}
          </div>
        </div>
        <div className="dialog-bubble clear-dialog" style={{ '--accent': room.accentColor }}>
          {room.clear.map((line, i) => (
            <p key={i} className="dialog-text">{line}</p>
          ))}
        </div>

        <button
          className="continue-btn"
          onClick={onContinue}
          style={{ background: room.accentColor }}
        >
          {room.id < 4 ? '다음 방으로! ▶' : '엔딩 보기 🏆'}
        </button>
      </div>
    </div>
  );
}

export default function GameRoom({
  room, questions, currentQuestion, roomStars,
  isCleared, onAnswer, onClear, onBack
}) {
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    setShowDialog(true);
  }, [room.id]);

  return (
    <div className="screen game-screen" style={{ background: room.bgGradient }}>
      <div className="game-top-bar">
        <button className="back-btn" onClick={onBack}>← 나가기</button>
        <h2 className="room-title-bar">
          {room.emoji} {room.name}
        </h2>
      </div>

      {showDialog && !isCleared ? (
        <NPCDialog
          room={room}
          lines={room.intro}
          onComplete={() => setShowDialog(false)}
        />
      ) : isCleared ? (
        <RoomClearView room={room} stars={roomStars} onContinue={onClear} />
      ) : (
        <QuestionView
          room={room}
          question={questions[currentQuestion]}
          qIndex={currentQuestion}
          total={questions.length}
          stars={roomStars}
          onAnswer={onAnswer}
        />
      )}
    </div>
  );
}
