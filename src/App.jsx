import { useState, useEffect, useCallback } from 'react';
import { load, save, reset } from './utils/storage';
import { ROOMS, INTRO_STORY, ENDINGS } from './data/gameData';
import Screens from './components/Screens';
import ExploreRoom from './components/ExploreRoom';

export default function App() {
  const [gs, setGs] = useState(() => load());
  const [fade, setFade] = useState(false);

  useEffect(() => { save(gs); }, [gs]);

  const tr = useCallback((cb) => {
    setFade(true);
    setTimeout(() => { cb(); setFade(false); }, 350);
  }, []);

  const room = gs.roomId ? ROOMS.find(r => r.id === gs.roomId) : null;
  const totalStars = Object.values(gs.rooms).reduce((s, r) => s + r.stars, 0);

  // ─── Handlers ───
  const handleIntroEnd = () => tr(() => setGs(s => ({ ...s, screen: 'rooms' })));

  const handleSelectRoom = (id) => tr(() => {
    setGs(s => {
      // if replaying a cleared room, reset its state
      const isReplay = s.rooms[id].cleared;
      return {
        ...s,
        screen: 'game',
        roomId: id,
        rooms: {
          ...s.rooms,
          [id]: isReplay
            ? { solved: {}, items: [], stars: 0, cleared: false }
            : s.rooms[id]
        }
      };
    });
  });

  const handleSolve = (objId, starEarned) => {
    setGs(s => {
      const rs = s.rooms[s.roomId];
      return {
        ...s,
        rooms: {
          ...s.rooms,
          [s.roomId]: {
            ...rs,
            solved: { ...rs.solved, [objId]: true },
            stars: rs.stars + (starEarned ? 1 : 0),
          }
        }
      };
    });
  };

  const handleCollectItem = (itemLabel) => {
    setGs(s => {
      const rs = s.rooms[s.roomId];
      if (rs.items.includes(itemLabel)) return s;
      return {
        ...s,
        rooms: {
          ...s.rooms,
          [s.roomId]: { ...rs, items: [...rs.items, itemLabel] }
        }
      };
    });
  };

  const handleRoomClear = () => {
    setGs(s => {
      const rid = s.roomId;
      const newUnlocked = [...s.unlocked];
      if (rid < 4 && !newUnlocked.includes(rid + 1)) newUnlocked.push(rid + 1);
      return {
        ...s,
        unlocked: newUnlocked,
        rooms: { ...s.rooms, [rid]: { ...s.rooms[rid], cleared: true } }
      };
    });
  };

  const handleExitRoom = () => tr(() => {
    const allCleared = gs.rooms[1].cleared && gs.rooms[2].cleared && gs.rooms[3].cleared && gs.rooms[4].cleared;
    setGs(s => ({ ...s, screen: allCleared ? 'ending' : 'rooms', roomId: null }));
  });

  const handleBackToRooms = () => tr(() => setGs(s => ({ ...s, screen: 'rooms', roomId: null })));

  const handleReset = () => {
    if (window.confirm('정말 처음부터 다시 시작할까요?')) {
      tr(() => setGs(reset()));
    }
  };

  const ending = totalStars >= ENDINGS.master.min
    ? ENDINGS.master
    : totalStars >= ENDINGS.wizard.min
    ? ENDINGS.wizard
    : ENDINGS.apprentice;

  return (
    <div className={`app ${fade ? 'fade' : ''}`}>
      {gs.screen === 'intro' && (
        <Screens.Intro story={INTRO_STORY} onDone={handleIntroEnd} />
      )}
      {gs.screen === 'rooms' && (
        <Screens.RoomSelect
          rooms={ROOMS}
          gs={gs}
          totalStars={totalStars}
          onSelect={handleSelectRoom}
          onReset={handleReset}
        />
      )}
      {gs.screen === 'game' && room && (
        <ExploreRoom
          room={room}
          roomState={gs.rooms[gs.roomId]}
          onSolve={handleSolve}
          onCollect={handleCollectItem}
          onClear={handleRoomClear}
          onExit={handleExitRoom}
          onBack={handleBackToRooms}
        />
      )}
      {gs.screen === 'ending' && (
        <Screens.Ending
          ending={ending}
          totalStars={totalStars}
          rooms={ROOMS}
          gs={gs}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
