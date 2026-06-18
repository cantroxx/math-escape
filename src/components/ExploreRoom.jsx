import { useState, useEffect, useRef } from 'react';

// ─── Character component ───
function Character({ x, y, moving }) {
  return (
    <div
      className={`character ${moving ? 'walking' : ''}`}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      🧑
    </div>
  );
}

// ─── Interactive Object ───
function ObjectSprite({ obj, solved, active, onClick }) {
  const isSolved = solved;
  return (
    <button
      className={`obj-sprite ${isSolved ? 'solved' : ''} ${active ? 'active' : ''} obj-${obj.type}`}
      style={{ left: `${obj.x}%`, top: `${obj.y}%`, fontSize: obj.size || 40 }}
      onClick={() => onClick(obj)}
      title={obj.label}
    >
      <span className="obj-emoji">{obj.emoji}</span>
      {!isSolved && obj.type !== 'npc' && obj.type !== 'clue' && (
        <span className="obj-glow" />
      )}
      <span className="obj-label">{obj.label}</span>
    </button>
  );
}

// ─── Inventory Bar ───
function Inventory({ items, room }) {
  const exitObj = room.objects.find(o => o.type === 'exit');
  const maxItems = exitObj?.requireCount || 0;
  return (
    <div className="inventory" style={{ '--accent': room.accent }}>
      <span className="inv-icon">🎒</span>
      <div className="inv-slots">
        {Array.from({ length: maxItems }).map((_, i) => (
          <div key={i} className={`inv-slot ${items[i] ? 'filled' : ''}`}>
            {items[i] || ''}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Dialog Modal ───
function DialogModal({ lines, onClose }) {
  const [i, setI] = useState(0);
  return (
    <div className="modal-overlay" onClick={() => i < lines.length - 1 ? setI(x => x + 1) : onClose()}>
      <div className="modal-dialog">
        <p>{lines[i]}</p>
        <div className="modal-footer">
          <div className="dots">{lines.map((_, j) => <span key={j} className={`dot ${j <= i ? 'on' : ''}`} />)}</div>
          <span className="tap-hint">{i < lines.length - 1 ? '탭 ▶' : '닫기 ✕'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── NPC Modal ───
function NPCModal({ obj, roomState, onClose }) {
  const runeCount = roomState.items.length;
  const maxKey = Object.keys(obj.hints).reduce((a, b) => Math.max(a, b), 0);
  const hintKey = Math.min(runeCount, maxKey);
  const hint = obj.hints[hintKey];

  const [phase, setPhase] = useState('greeting');
  const [gi, setGi] = useState(0);

  const handleTap = () => {
    if (phase === 'greeting') {
      if (gi < obj.greeting.length - 1) setGi(x => x + 1);
      else setPhase('hint');
    } else {
      onClose();
    }
  };

  const text = phase === 'greeting' ? obj.greeting[gi] : hint;

  return (
    <div className="modal-overlay" onClick={handleTap}>
      <div className="modal-npc">
        <div className="mnpc-avatar">{obj.emoji}</div>
        <div className="mnpc-name">{obj.name}</div>
        <div className="modal-dialog">
          <p>{text}</p>
          <span className="tap-hint">{phase === 'hint' ? '닫기 ✕' : '탭 ▶'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Math Puzzle Modal ───
function MathModal({ obj, onSolve, onClose }) {
  const problem = obj.problems[0];
  const [sel, setSel] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const correct = sel === problem.a;

  const handleConfirm = () => { if (sel !== null) setShowResult(true); };
  const handleNext = () => {
    if (correct) {
      onSolve(obj.id, !usedHint);
    } else {
      setSel(null);
      setShowResult(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-math" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="mm-header">
          <span className="mm-emoji">{obj.emoji}</span>
          <span className="mm-label">{obj.label}</span>
        </div>
        <p className="mm-question">{problem.q}</p>
        <div className="mm-choices">
          {problem.c.map((c, i) => {
            let cls = 'mm-choice';
            if (sel === i) cls += ' selected';
            if (showResult && i === problem.a) cls += ' correct';
            if (showResult && i === sel && !correct) cls += ' wrong';
            return (
              <button key={i} className={cls} onClick={() => !showResult && setSel(i)} disabled={showResult}>
                <span className="mm-marker">{['①', '②', '③', '④'][i]}</span>
                <span>{c}</span>
              </button>
            );
          })}
        </div>

        {showResult && (
          <div className={`mm-result ${correct ? 'ok' : 'fail'}`}>
            <span className="mm-result-emoji">{correct ? '🎉' : '😅'}</span>
            <p className="mm-result-msg">{correct ? '정답!' : '아쉬워요! 다시 도전!'}</p>
            {correct && !usedHint && <p className="mm-star">⭐ +1</p>}
            {correct && obj.runeLabel && <p className="mm-rune">🔮 {obj.runeLabel} 획득!</p>}
            <p className="mm-exp">{problem.e}</p>
          </div>
        )}

        {showHint && !showResult && (
          <div className="mm-hint">💡 문제를 천천히 읽고 하나씩 계산해봐!</div>
        )}

        <div className="mm-actions">
          {!showResult ? (
            <>
              {!showHint && <button className="btn-hint" onClick={() => { setShowHint(true); setUsedHint(true); }}>💡 힌트</button>}
              <button className="btn-primary" onClick={handleConfirm} disabled={sel === null}>정답 확인</button>
            </>
          ) : (
            <button className="btn-primary" onClick={handleNext}>
              {correct ? '확인 ✓' : '다시 풀기 🔄'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Combination Puzzle Modal ───
function ComboModal({ obj, onSolve }) {
  const { combo } = obj;
  const [order, setOrder] = useState([]);
  const [result, setResult] = useState(null); // null | 'wrong' | 'correct'

  const handlePick = (idx) => {
    if (order.includes(idx) || result) return;
    const newOrder = [...order, idx];
    setOrder(newOrder);

    if (newOrder.length === combo.items.length) {
      const isCorrect = newOrder.every((v, i) => v === combo.correctOrder[i]);
      if (isCorrect) {
        setResult('correct');
        setTimeout(() => onSolve(), 1200);
      } else {
        setResult('wrong');
        setTimeout(() => { setOrder([]); setResult(null); }, 1000);
      }
    }
  };

  const handleReset = () => { setOrder([]); setResult(null); };

  return (
    <div className="modal-overlay">
      <div className="modal-combo" onClick={e => e.stopPropagation()}>
        <div className="mc-emoji">{obj.emoji}</div>
        <p className="mc-instruction">{combo.instruction}</p>

        <div className="mc-items">
          {combo.items.map((item, idx) => {
            const picked = order.includes(idx);
            const pickOrder = order.indexOf(idx);
            return (
              <button
                key={idx}
                className={`mc-item ${picked ? 'picked' : ''} ${result === 'wrong' ? 'shake' : ''} ${result === 'correct' ? 'glow' : ''}`}
                onClick={() => handlePick(idx)}
              >
                {picked && <span className="mc-badge">{pickOrder + 1}</span>}
                <span>{item}</span>
              </button>
            );
          })}
        </div>

        <div className="mc-order">
          {Array.from({ length: combo.items.length }).map((_, i) => (
            <span key={i} className={`mc-slot ${order[i] !== undefined ? 'filled' : ''}`}>
              {order[i] !== undefined ? combo.items[order[i]] : `${i + 1}번째`}
            </span>
          ))}
        </div>

        {result === 'correct' && (
          <div className="mc-success">✨ {combo.successMsg}</div>
        )}
        {result === 'wrong' && (
          <div className="mc-fail">순서가 틀렸어요! 다시 해봐요 🔄</div>
        )}

        {!result && order.length > 0 && (
          <button className="btn-secondary" onClick={handleReset}>초기화 🔄</button>
        )}
      </div>
    </div>
  );
}

// ─── Room Clear Modal ───
function ClearModal({ room, stars, onContinue }) {
  const [di, setDi] = useState(0);
  const lines = room.clearDialog;
  const npc = room.objects.find(o => o.type === 'npc');

  return (
    <div className="modal-overlay" onClick={() => di < lines.length - 1 ? setDi(x => x + 1) : onContinue()}>
      <div className="modal-clear">
        <div className="mc-key">🔑</div>
        <h2>탈출 성공!</h2>
        <p className="mc-room">{room.emoji} {room.name} 클리어!</p>
        <div className="mc-stars-row">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="mc-star">{i < stars ? '⭐' : '☆'}</span>
          ))}
        </div>
        {npc && <div className="mc-npc">{npc.emoji}</div>}
        <div className="modal-dialog">
          <p>{lines[di]}</p>
        </div>
        <div className="tap-hint">{di < lines.length - 1 ? '탭 ▶' : '계속 →'}</div>
      </div>
    </div>
  );
}

// ─── Main ExploreRoom ───
export default function ExploreRoom({ room, roomState, onSolve, onCollect, onClear, onExit, onBack }) {
  const [charPos, setCharPos] = useState({ x: 50, y: 82 });
  const [moving, setMoving] = useState(false);
  const [modal, setModal] = useState(null); // { type, obj }
  const [cleared, setCleared] = useState(false);
  const [hintText, setHintText] = useState('빛나는 물건을 탭해서 조사해보세요!');
  const moveTimeout = useRef(null);

  // update hint when items change
  useEffect(() => {
    const npc = room.objects.find(o => o.type === 'npc');
    if (npc) {
      const count = roomState.items.length;
      const maxKey = Math.max(...Object.keys(npc.hints).map(Number));
      const key = Math.min(count, maxKey);
      setHintText(`${npc.name}: "${npc.hints[key]}"`);
    }
  }, [roomState.items.length, room]);

  const handleObjectClick = (obj) => {
    if (modal || moving || cleared) return;

    // move character toward object
    const targetX = Math.max(10, Math.min(90, obj.x));
    const targetY = Math.max(30, Math.min(85, obj.y + 12));
    setMoving(true);
    setCharPos({ x: targetX, y: targetY });

    if (moveTimeout.current) clearTimeout(moveTimeout.current);
    moveTimeout.current = setTimeout(() => {
      setMoving(false);
      openInteraction(obj);
    }, 450);
  };

  const openInteraction = (obj) => {
    if (obj.type === 'clue') {
      setModal({ type: 'dialog', obj });
    } else if (obj.type === 'npc') {
      setModal({ type: 'npc', obj });
    } else if (obj.type === 'math') {
      if (roomState.solved[obj.id]) {
        // already solved
        setModal({ type: 'dialog', obj: { dialog: [`이미 풀었어요! 🔮 ${obj.runeLabel} 획득 완료.`] } });
      } else {
        setModal({ type: 'math', obj });
      }
    } else if (obj.type === 'exit') {
      if (roomState.items.length < obj.requireCount) {
        const remain = obj.requireCount - roomState.items.length;
        setModal({ type: 'dialog', obj: { dialog: [`아직 잠겨 있어요!\n${remain}개의 아이템을 더 모아야 해요. 🔍`] } });
      } else {
        setModal({ type: 'combo', obj });
      }
    }
  };

  const handleMathSolve = (objId, starEarned) => {
    const obj = room.objects.find(o => o.id === objId);
    onSolve(objId, starEarned);
    if (obj.runeLabel) {
      onCollect(obj.runeLabel);
    }
    setModal(null);
  };

  const handleComboSolve = () => {
    onClear();
    setCleared(true);
    setTimeout(() => setModal({ type: 'clear' }), 600);
  };

  const handleClearContinue = () => {
    setModal(null);
    onExit();
  };

  // count decorative elements
  const wallDecos = Array.from({ length: 5 }).map((_, i) => ({
    left: `${15 + i * 18}%`,
    top: '8%',
  }));

  return (
    <div className="screen screen-game" style={{ background: room.bg, '--accent': room.accent }}>
      {/* Top bar */}
      <div className="game-bar">
        <button className="btn-back" onClick={onBack}>← 나가기</button>
        <h2>{room.emoji} {room.name}</h2>
        <div className="game-stars">⭐ {roomState.stars}</div>
      </div>

      {/* Room area */}
      <div className="room-area">
        {/* Wall decorations */}
        <div className="wall-section">
          {wallDecos.map((d, i) => (
            <span key={i} className="wall-deco" style={d}>{room.wallDeco}</span>
          ))}
        </div>

        {/* Floor */}
        <div className="floor-section" style={{ background: room.floorColor }} />

        {/* Objects */}
        {room.objects.map(obj => (
          <ObjectSprite
            key={obj.id}
            obj={obj}
            solved={!!roomState.solved[obj.id]}
            active={!modal && !moving && !cleared}
            onClick={handleObjectClick}
          />
        ))}

        {/* Character */}
        <Character x={charPos.x} y={charPos.y} moving={moving} />
      </div>

      {/* Inventory + hint */}
      <div className="bottom-bar">
        <Inventory items={roomState.items} room={room} />
        <div className="hint-bar">💬 {hintText}</div>
      </div>

      {/* Modals */}
      {modal?.type === 'dialog' && (
        <DialogModal lines={modal.obj.dialog} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'npc' && (
        <NPCModal obj={modal.obj} roomState={roomState} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'math' && (
        <MathModal obj={modal.obj} onSolve={handleMathSolve} onClose={() => setModal(null)} />
      )}
      {modal?.type === 'combo' && (
        <ComboModal obj={modal.obj} onSolve={handleComboSolve} />
      )}
      {modal?.type === 'clear' && (
        <ClearModal room={room} stars={roomState.stars} onContinue={handleClearContinue} />
      )}
    </div>
  );
}
