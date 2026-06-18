import { useState, useEffect } from 'react';

export default function GameRoom({ room, roomState, onAdvance, onClear, onExit, onBack }) {
  const step = room.steps[roomState.stepIdx];

  // room finished all steps → exit
  if (!step) {
    return (
      <div className="vn-screen">
        <div className="vn-bg" style={{ backgroundImage: `url(${room.selectImg})` }} />
        <div className="vn-gradient" />
        <div className="vn-bottom">
          <div className="vn-text-box">
            <p className="vn-text">다음 방으로 이동한다...</p>
          </div>
          <button className="vn-btn" onClick={onExit}>계속</button>
        </div>
      </div>
    );
  }

  return (
    <div className="vn-screen">
      <div className="vn-bg" style={{ backgroundImage: `url(${step.img})` }}>
        <button className="game-back" onClick={onBack}>나가기</button>
        <span className="game-info">{room.name} — {room.unit}</span>
      </div>
      <div className="vn-gradient" />
      <div className="vn-bottom">
        {step.type === 'story' && (
          <StoryPanel step={step} onDone={() => onAdvance(false)} />
        )}
        {step.type === 'quiz' && (
          <QuizPanel step={step} onSolve={(star) => onAdvance(star)} />
        )}
        {step.type === 'combo' && (
          <ComboPanel step={step} onSolve={() => { onAdvance(false); onClear(); }} />
        )}
      </div>
    </div>
  );
}

// ─── Story Panel ───
function StoryPanel({ step, onDone }) {
  const [idx, setIdx] = useState(0);
  useEffect(() => { setIdx(0); }, [step]);

  const handleTap = () => {
    if (idx < step.lines.length - 1) setIdx(i => i + 1);
    else onDone();
  };

  return (
    <div className="vn-text-box" onClick={handleTap}>
      <p className="vn-text">{step.lines[idx]}</p>
      <span className="vn-tap">{idx < step.lines.length - 1 ? '탭하여 계속' : '탭하여 진행'}</span>
    </div>
  );
}

// ─── Quiz Panel ───
function QuizPanel({ step, onSolve }) {
  const [phase, setPhase] = useState('narration'); // narration → quiz → result
  const [sel, setSel] = useState(null);
  const [showed, setShowed] = useState(false);
  const [hint, setHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);

  const p = step.problem;
  const correct = sel === p.a;

  useEffect(() => {
    setPhase('narration'); setSel(null); setShowed(false); setHint(false); setUsedHint(false);
  }, [step]);

  if (phase === 'narration') {
    return (
      <div className="vn-text-box" onClick={() => setPhase('quiz')}>
        <p className="vn-label">{step.title}</p>
        <p className="vn-text">{step.narration}</p>
        <span className="vn-tap">탭하여 도전</span>
      </div>
    );
  }

  return (
    <div className="quiz-box">
      <p className="quiz-q">{p.q}</p>
      <div className="quiz-choices">
        {p.c.map((c, i) => {
          let cls = 'quiz-c';
          if (sel === i) cls += ' sel';
          if (showed && i === p.a) cls += ' ok';
          if (showed && i === sel && !correct) cls += ' no';
          return (
            <button key={i} className={cls} onClick={() => !showed && setSel(i)} disabled={showed}>
              {c}
            </button>
          );
        })}
      </div>

      {showed && (
        <div className={`quiz-result ${correct ? 'ok' : 'fail'}`}>
          <p className="qr-msg">{correct ? '정답!' : '오답. 다시 도전하세요.'}</p>
          {correct && !usedHint && <p className="qr-star">+1점</p>}
          <p className="qr-exp">{p.e}</p>
        </div>
      )}

      {hint && !showed && (
        <div className="quiz-hint">천천히 하나씩 계산해 보세요.</div>
      )}

      <div className="quiz-actions">
        {!showed ? (
          <>
            {!hint && <button className="vn-btn ghost" onClick={() => { setHint(true); setUsedHint(true); }}>힌트</button>}
            <button className="vn-btn" onClick={() => sel !== null && setShowed(true)} disabled={sel === null}>확인</button>
          </>
        ) : (
          <button className="vn-btn" onClick={() => {
            if (correct) onSolve(!usedHint);
            else { setSel(null); setShowed(false); }
          }}>
            {correct ? '다음으로' : '다시 풀기'}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Combo Panel ───
function ComboPanel({ step, onSolve }) {
  const [phase, setPhase] = useState('narration');
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null);
  const combo = step.combo;

  useEffect(() => { setPhase('narration'); setOrder([]); setResult(null); }, [step]);

  if (phase === 'narration') {
    return (
      <div className="vn-text-box" onClick={() => setPhase('puzzle')}>
        <p className="vn-label">{step.title}</p>
        <p className="vn-text">{step.narration}</p>
        <span className="vn-tap">탭하여 도전</span>
      </div>
    );
  }

  const handlePick = (idx) => {
    if (order.includes(idx) || result) return;
    const next = [...order, idx];
    setOrder(next);
    if (next.length === combo.items.length) {
      const ok = next.every((v, i) => v === combo.correctOrder[i]);
      if (ok) { setResult('ok'); setTimeout(onSolve, 1500); }
      else { setResult('fail'); setTimeout(() => { setOrder([]); setResult(null); }, 1200); }
    }
  };

  return (
    <div className="combo-box">
      <p className="combo-inst">{combo.instruction}</p>
      <div className="combo-items">
        {combo.items.map((item, i) => {
          const picked = order.includes(i);
          const n = order.indexOf(i);
          return (
            <button key={i}
              className={`combo-c ${picked ? 'picked' : ''} ${result === 'fail' ? 'shake' : ''} ${result === 'ok' ? 'glow' : ''}`}
              onClick={() => handlePick(i)}>
              {picked && <span className="combo-n">{n + 1}</span>}
              {item}
            </button>
          );
        })}
      </div>
      {result === 'ok' && <p className="combo-ok">{combo.successMsg}</p>}
      {result === 'fail' && <p className="combo-fail">순서가 틀렸습니다. 다시 시도하세요.</p>}
      {!result && order.length > 0 && (
        <button className="vn-btn ghost small" onClick={() => setOrder([])}>초기화</button>
      )}
    </div>
  );
}
