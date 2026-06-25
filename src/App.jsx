import { useState, useEffect, useCallback } from 'react';
import { load, save, reset } from './utils/storage';
import { ROOMS, HARD_ROOMS, INTRO_SCENES, ENDING_SCENES, ENDINGS, HARD_ENDINGS } from './data/gameData';
import AudioManager from './components/AudioManager';
import IntroScreen from './components/IntroScreen';
import RoomSelect from './components/RoomSelect';
import GameRoom from './components/GameRoom';
import EndingScreen from './components/EndingScreen';

export default function App() {
  const [gs, setGs] = useState(() => load());
  const [fade, setFade] = useState(false);

  useEffect(() => { save(gs); }, [gs]);

  const tr = useCallback((cb) => {
    setFade(true);
    setTimeout(() => { cb(); setFade(false); }, 400);
  }, []);

  const activeDiff = gs.difficulty || 'normal';
  const diffState = gs[activeDiff] || gs.normal;
  const roomsData = activeDiff === 'hard' ? HARD_ROOMS : ROOMS;

  const room = gs.roomId ? roomsData.find(r => r.id === gs.roomId) : null;
  const totalStars = Object.values(diffState.rooms).reduce((s, r) => s + r.stars, 0);

  const currentEndings = activeDiff === 'hard' ? HARD_ENDINGS : ENDINGS;
  const ending = totalStars >= currentEndings.master.min ? currentEndings.master
    : totalStars >= currentEndings.wizard.min ? currentEndings.wizard : currentEndings.apprentice;

  return (
    <div className={`app ${fade ? 'fade' : ''}`}>
      <AudioManager />
      {gs.screen === 'intro' && (
        <IntroScreen scenes={INTRO_SCENES} onDone={() => tr(() => setGs(s => ({ ...s, screen: 'rooms' })))} />
      )}
      {gs.screen === 'rooms' && (
        <RoomSelect
          rooms={roomsData}
          unlocked={diffState.unlocked}
          roomsState={diffState.rooms}
          difficulty={activeDiff}
          totalStars={totalStars}
          onSelect={(id) => tr(() => setGs(s => {
            const currentDiff = s.difficulty || 'normal';
            const diffObj = s[currentDiff];
            const replay = diffObj.rooms[id].cleared;
            return { ...s, screen: 'game', roomId: id,
              [currentDiff]: { ...diffObj,
                rooms: { ...diffObj.rooms, [id]: replay ? { stepIdx: 0, items: [], stars: 0, cleared: false } : diffObj.rooms[id] }
              }
            };
          }))}
          onChangeDifficulty={(diff) => setGs(s => ({ ...s, difficulty: diff }))}
          onReset={() => { if (confirm('처음부터 다시 시작할까요?')) tr(() => setGs(reset())); }}
        />
      )}
      {gs.screen === 'game' && room && (
        <GameRoom room={room} roomState={diffState.rooms[gs.roomId]}
          onAdvance={(starEarned) => setGs(s => {
            const currentDiff = s.difficulty || 'normal';
            const diffObj = s[currentDiff];
            const rid = s.roomId;
            const rs = diffObj.rooms[rid];
            return { ...s,
              [currentDiff]: { ...diffObj,
                rooms: { ...diffObj.rooms, [rid]: { ...rs, stepIdx: rs.stepIdx + 1, stars: rs.stars + (starEarned ? 1 : 0) } }
              }
            };
          })}
          onClear={() => setGs(s => {
            const currentDiff = s.difficulty || 'normal';
            const diffObj = s[currentDiff];
            const rid = s.roomId;
            const nu = [...diffObj.unlocked];
            if (rid < 4 && !nu.includes(rid + 1)) nu.push(rid + 1);
            return { ...s,
              [currentDiff]: { ...diffObj,
                unlocked: nu,
                rooms: { ...diffObj.rooms, [rid]: { ...diffObj.rooms[rid], cleared: true } }
              }
            };
          })}
          onExit={() => tr(() => {
            const currentDiff = gs.difficulty || 'normal';
            const diffObj = gs[currentDiff];
            const allDone = Object.values(diffObj.rooms).every(r => r.cleared);
            setGs(s => ({ ...s, screen: allDone ? 'ending' : 'rooms', roomId: null }));
          })}
          onBack={() => tr(() => setGs(s => ({ ...s, screen: 'rooms', roomId: null })))}
        />
      )}
      {gs.screen === 'ending' && (
        <EndingScreen
          scenes={ENDING_SCENES}
          ending={ending}
          totalStars={totalStars}
          rooms={roomsData}
          roomsState={diffState.rooms}
          maxStars={activeDiff === 'hard' ? 40 : 20}
          onReset={() => { if (confirm('처음부터 다시 시작할까요?')) tr(() => setGs(reset())); }}
        />
      )}
    </div>
  );
}
