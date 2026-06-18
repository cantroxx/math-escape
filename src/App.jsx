import { useState, useEffect, useCallback } from 'react';
import { loadGame, saveGame, resetGame } from './utils/storage';
import { ROOMS, INTRO_STORY, ENDING_STORY } from './data/story';
import { QUESTIONS } from './data/questions';
import IntroScreen from './components/IntroScreen';
import RoomSelect from './components/RoomSelect';
import GameRoom from './components/GameRoom';
import EndingScreen from './components/EndingScreen';

export default function App() {
  const [gameState, setGameState] = useState(() => loadGame());
  const [fade, setFade] = useState(false);

  useEffect(() => {
    saveGame(gameState);
  }, [gameState]);

  const transition = useCallback((cb) => {
    setFade(true);
    setTimeout(() => {
      cb();
      setFade(false);
    }, 400);
  }, []);

  const handleIntroComplete = () => {
    transition(() => {
      setGameState(s => ({ ...s, currentScreen: 'rooms', introSeen: true }));
    });
  };

  const handleRoomSelect = (roomId) => {
    transition(() => {
      setGameState(s => {
        const isReplay = s.roomCleared[roomId];
        return {
          ...s,
          currentScreen: 'game',
          currentRoom: roomId,
          currentQuestion: 0,
          roomProgress: { ...s.roomProgress, [roomId]: isReplay ? 0 : s.roomProgress[roomId] },
          roomStars: { ...s.roomStars, [roomId]: isReplay ? 0 : s.roomStars[roomId] },
          roomHints: { ...s.roomHints, [roomId]: isReplay ? 0 : s.roomHints[roomId] },
          roomCleared: { ...s.roomCleared, [roomId]: isReplay ? false : s.roomCleared[roomId] },
        };
      });
    });
  };

  const handleAnswer = (isCorrect, usedHint) => {
    const { currentRoom, currentQuestion } = gameState;
    const totalQ = QUESTIONS[currentRoom].length;
    const nextQ = currentQuestion + 1;

    if (isCorrect) {
      setGameState(s => {
        const newProgress = { ...s.roomProgress, [currentRoom]: nextQ };
        const newStars = {
          ...s.roomStars,
          [currentRoom]: s.roomStars[currentRoom] + (usedHint ? 0 : 1)
        };
        const newHints = {
          ...s.roomHints,
          [currentRoom]: s.roomHints[currentRoom] + (usedHint ? 1 : 0)
        };

        if (nextQ >= totalQ) {
          const newCleared = { ...s.roomCleared, [currentRoom]: true };
          const newUnlocked = [...s.unlockedRooms];
          if (currentRoom < 4 && !newUnlocked.includes(currentRoom + 1)) {
            newUnlocked.push(currentRoom + 1);
          }
          return {
            ...s,
            currentScreen: 'clear',
            roomProgress: newProgress,
            roomStars: newStars,
            roomHints: newHints,
            roomCleared: newCleared,
            unlockedRooms: newUnlocked,
          };
        }

        return {
          ...s,
          currentQuestion: nextQ,
          roomProgress: newProgress,
          roomStars: newStars,
          roomHints: newHints,
        };
      });
    }
  };

  const handleRoomClear = () => {
    transition(() => {
      setGameState(s => {
        const allCleared = s.roomCleared[1] && s.roomCleared[2] && s.roomCleared[3] && s.roomCleared[4];
        if (allCleared) {
          return { ...s, currentScreen: 'ending' };
        }
        return { ...s, currentScreen: 'rooms', currentRoom: null };
      });
    });
  };

  const handleBackToRooms = () => {
    transition(() => {
      setGameState(s => ({ ...s, currentScreen: 'rooms', currentRoom: null }));
    });
  };

  const handleReset = () => {
    if (window.confirm('정말 처음부터 다시 시작할까요?\n저장된 진행 상황이 모두 사라집니다.')) {
      transition(() => {
        setGameState(resetGame());
      });
    }
  };

  const { currentScreen } = gameState;
  const activeRoomId = gameState.currentRoom;
  const room = activeRoomId ? ROOMS.find(r => r.id === activeRoomId) : null;

  const totalStars = Object.values(gameState.roomStars).reduce((a, b) => a + b, 0);
  const ending = totalStars >= ENDING_STORY.master.minStars
    ? ENDING_STORY.master
    : totalStars >= ENDING_STORY.wizard.minStars
    ? ENDING_STORY.wizard
    : ENDING_STORY.apprentice;

  return (
    <div className={`app-wrapper ${fade ? 'fade-out' : 'fade-in'}`}>
      {currentScreen === 'intro' && (
        <IntroScreen story={INTRO_STORY} onComplete={handleIntroComplete} />
      )}

      {currentScreen === 'rooms' && (
        <RoomSelect
          rooms={ROOMS}
          gameState={gameState}
          onSelect={handleRoomSelect}
          onReset={handleReset}
        />
      )}

      {(currentScreen === 'game' || currentScreen === 'clear') && room && (
        <GameRoom
          room={room}
          questions={QUESTIONS[activeRoomId]}
          currentQuestion={gameState.currentQuestion}
          roomStars={gameState.roomStars[activeRoomId]}
          isCleared={currentScreen === 'clear'}
          onAnswer={handleAnswer}
          onClear={handleRoomClear}
          onBack={handleBackToRooms}
        />
      )}

      {currentScreen === 'ending' && (
        <EndingScreen
          ending={ending}
          totalStars={totalStars}
          roomStars={gameState.roomStars}
          rooms={ROOMS}
          onReset={handleReset}
        />
      )}
    </div>
  );
}
