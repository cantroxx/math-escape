const KEY = 'math-escape-v2';

const DEFAULT = {
  screen: 'intro',       // intro | rooms | game | ending
  roomId: null,
  unlocked: [1],
  // per-room state: { [roomId]: { solved: {objId: true}, items: [...], stars: 0, cleared: false } }
  rooms: {
    1: { solved: {}, items: [], stars: 0, cleared: false },
    2: { solved: {}, items: [], stars: 0, cleared: false },
    3: { solved: {}, items: [], stars: 0, cleared: false },
    4: { solved: {}, items: [], stars: 0, cleared: false },
  }
};

export function load() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const parsed = JSON.parse(s);
      // merge with defaults for safety
      return {
        ...DEFAULT,
        ...parsed,
        rooms: {
          1: { ...DEFAULT.rooms[1], ...parsed.rooms?.[1] },
          2: { ...DEFAULT.rooms[2], ...parsed.rooms?.[2] },
          3: { ...DEFAULT.rooms[3], ...parsed.rooms?.[3] },
          4: { ...DEFAULT.rooms[4], ...parsed.rooms?.[4] },
        }
      };
    }
  } catch (e) { console.error(e); }
  return { ...DEFAULT, rooms: { ...DEFAULT.rooms } };
}

export function save(state) {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.error(e); }
}

export function reset() {
  try { localStorage.removeItem(KEY); } catch (e) {}
  return {
    ...DEFAULT,
    rooms: {
      1: { solved: {}, items: [], stars: 0, cleared: false },
      2: { solved: {}, items: [], stars: 0, cleared: false },
      3: { solved: {}, items: [], stars: 0, cleared: false },
      4: { solved: {}, items: [], stars: 0, cleared: false },
    }
  };
}
