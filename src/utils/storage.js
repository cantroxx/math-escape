const KEY = 'math-dungeon-v4';
const DEF = {
  screen: 'intro',
  difficulty: 'normal',
  roomId: null,
  normal: {
    unlocked: [1],
    rooms: {
      1: { stepIdx: 0, items: [], stars: 0, cleared: false },
      2: { stepIdx: 0, items: [], stars: 0, cleared: false },
      3: { stepIdx: 0, items: [], stars: 0, cleared: false },
      4: { stepIdx: 0, items: [], stars: 0, cleared: false },
    }
  },
  hard: {
    unlocked: [1],
    rooms: {
      1: { stepIdx: 0, items: [], stars: 0, cleared: false },
      2: { stepIdx: 0, items: [], stars: 0, cleared: false },
      3: { stepIdx: 0, items: [], stars: 0, cleared: false },
      4: { stepIdx: 0, items: [], stars: 0, cleared: false },
    }
  }
};

export function load() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const p = JSON.parse(s);
      
      // 이미 신규 구조인 경우
      if (p.normal && p.hard) {
        return {
          ...DEF,
          ...p,
          normal: {
            unlocked: p.normal.unlocked || DEF.normal.unlocked,
            rooms: {
              1: { ...DEF.normal.rooms[1], ...p.normal.rooms?.[1] },
              2: { ...DEF.normal.rooms[2], ...p.normal.rooms?.[2] },
              3: { ...DEF.normal.rooms[3], ...p.normal.rooms?.[3] },
              4: { ...DEF.normal.rooms[4], ...p.normal.rooms?.[4] },
            }
          },
          hard: {
            unlocked: p.hard.unlocked || DEF.hard.unlocked,
            rooms: {
              1: { ...DEF.hard.rooms[1], ...p.hard.rooms?.[1] },
              2: { ...DEF.hard.rooms[2], ...p.hard.rooms?.[2] },
              3: { ...DEF.hard.rooms[3], ...p.hard.rooms?.[3] },
              4: { ...DEF.hard.rooms[4], ...p.hard.rooms?.[4] },
            }
          }
        };
      }
      
      // 구버전 구조인 경우 (최상위에 unlocked, rooms가 있는 경우)
      const normalRooms = p.rooms || {};
      const migrated = {
        screen: p.screen || DEF.screen,
        roomId: p.roomId !== undefined ? p.roomId : DEF.roomId,
        difficulty: p.difficulty || 'normal',
        normal: {
          unlocked: p.unlocked || DEF.normal.unlocked,
          rooms: {
            1: { ...DEF.normal.rooms[1], ...normalRooms[1] },
            2: { ...DEF.normal.rooms[2], ...normalRooms[2] },
            3: { ...DEF.normal.rooms[3], ...normalRooms[3] },
            4: { ...DEF.normal.rooms[4], ...normalRooms[4] },
          }
        },
        hard: JSON.parse(JSON.stringify(DEF.hard))
      };
      return migrated;
    }
  } catch {
    // Ignore storage read error
  }
  return JSON.parse(JSON.stringify(DEF));
}

export function save(s) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    // Ignore storage write error
  }
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Ignore storage reset error
  }
  return JSON.parse(JSON.stringify(DEF));
}
