const KEY = 'math-dungeon-v4';
const DEF = {
  screen: 'intro', roomId: null, unlocked: [1],
  rooms: {
    1: { stepIdx: 0, items: [], stars: 0, cleared: false },
    2: { stepIdx: 0, items: [], stars: 0, cleared: false },
    3: { stepIdx: 0, items: [], stars: 0, cleared: false },
    4: { stepIdx: 0, items: [], stars: 0, cleared: false },
  }
};
export function load() {
  try { const s = localStorage.getItem(KEY); if (s) { const p = JSON.parse(s); return { ...DEF, ...p, rooms: { 1:{...DEF.rooms[1],...p.rooms?.[1]}, 2:{...DEF.rooms[2],...p.rooms?.[2]}, 3:{...DEF.rooms[3],...p.rooms?.[3]}, 4:{...DEF.rooms[4],...p.rooms?.[4]} } }; } } catch(e) {}
  return JSON.parse(JSON.stringify(DEF));
}
export function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch(e) {} }
export function reset() { try { localStorage.removeItem(KEY); } catch(e) {} return JSON.parse(JSON.stringify(DEF)); }
