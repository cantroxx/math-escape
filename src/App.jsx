import { useState, useEffect, useCallback } from 'react';
import { load, save, reset } from './utils/storage';
import { ROOMS, INTRO_SCENES, ENDING_SCENES, ENDINGS } from './data/gameData';
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

  const room = gs.roomId ? ROOMS.find(r => r.id === gs.roomId) : null;
  const totalStars = Object.values(gs.rooms).reduce((s, r) => s + r.stars, 0);

  const ending = totalStars >= ENDINGS.master.min ? ENDINGS.master
    : totalStars >= ENDINGS.wizard.min ? ENDINGS.wizard : ENDINGS.apprentice;

  return (
    <div className={`app ${fade ? 'fade' : ''}`}>
      {gs.screen === 'intro' && (
        <IntroScreen scenes={INTRO_SCENES} onDone={() => tr(() => setGs(s => ({ ...s, screen: 'rooms' })))} />
      )}
      {gs.screen === 'rooms' && (
        <RoomSelect rooms={ROOMS} gs={gs} totalStars={totalStars}
          onSelect={(id) => tr(() => setGs(s => {
            const replay = s.rooms[id].cleared;
            return { ...s, screen: 'game', roomId: id,
              rooms: { ...s.rooms, [id]: replay ? { stepIdx: 0, items: [], stars: 0, cleared: false } : s.rooms[id] }
            };
          }))}
          onReset={() => { if (confirm('처음부터 다시 시작할까요?')) tr(() => setGs(reset())); }}
        />
      )}
      {gs.screen === 'game' && room && (
        <GameRoom room={room} roomState={gs.rooms[gs.roomId]}
          onAdvance={(starEarned) => setGs(s => {
            const rid = s.roomId;
            const rs = s.rooms[rid];
            return { ...s, rooms: { ...s.rooms, [rid]: { ...rs, stepIdx: rs.stepIdx + 1, stars: rs.stars + (starEarned ? 1 : 0) } } };
          })}
          onClear={() => setGs(s => {
            const rid = s.roomId;
            const nu = [...s.unlocked];
            if (rid < 4 && !nu.includes(rid + 1)) nu.push(rid + 1);
            return { ...s, unlocked: nu, rooms: { ...s.rooms, [rid]: { ...s.rooms[rid], cleared: true } } };
          })}
          onExit={() => tr(() => {
            const allDone = Object.values(gs.rooms).every(r => r.cleared);
            setGs(s => ({ ...s, screen: allDone ? 'ending' : 'rooms', roomId: null }));
          })}
          onBack={() => tr(() => setGs(s => ({ ...s, screen: 'rooms', roomId: null })))}
        />
      )}
      {gs.screen === 'ending' && (
        <EndingScreen scenes={ENDING_SCENES} ending={ending} totalStars={totalStars} rooms={ROOMS} gs={gs}
          onReset={() => { if (confirm('처음부터 다시 시작할까요?')) tr(() => setGs(reset())); }}
        />
      )}
    </div>
  );
}
