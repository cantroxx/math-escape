const SAVE_KEY = 'math-escape-save';

const DEFAULT_STATE = {
  currentScreen: 'intro', // intro, rooms, game, clear, ending
  introSeen: false,
  currentRoom: null,
  currentQuestion: 0,
  roomProgress: { 1: 0, 2: 0, 3: 0, 4: 0 },
  roomStars: { 1: 0, 2: 0, 3: 0, 4: 0 },
  roomHints: { 1: 0, 2: 0, 3: 0, 4: 0 },
  roomCleared: { 1: false, 2: false, 3: false, 4: false },
  unlockedRooms: [1],
};

export function loadGame() {
  try {
    const saved = localStorage.getItem(SAVE_KEY);
    if (saved) {
      return { ...DEFAULT_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Failed to load save:', e);
  }
  return { ...DEFAULT_STATE };
}

export function saveGame(state) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

export function resetGame() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {
    console.error('Failed to reset:', e);
  }
  return { ...DEFAULT_STATE };
}
