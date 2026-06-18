// ─── Room Definitions ───
// type: 'clue' | 'math' | 'npc' | 'exit'
// math objects give a rune item when solved
// exit objects require all runes + final combo puzzle

export const INTRO_STORY = [
  '수학 시험이 내일이라니…\n오늘은 일찍 자야지… 😴',
  '…어? 여기가 어디지?',
  '눈을 떠보니 낡은 마법학교에 갇혀 있었다!',
  '"4개의 방을 통과하면\n현실로 돌아갈 수 있다" 🔮',
  '수학의 힘으로 탈출하자! 💪'
];

export const ENDINGS = {
  master:     { title: '🏆 대마법사',   msg: '완벽한 탈출! 진정한 수학 대마법사!', min: 16 },
  wizard:     { title: '⭐ 수학 마법사', msg: '멋진 실력! 조금만 더 하면 대마법사!', min: 10 },
  apprentice: { title: '📚 수학 견습생', msg: '탈출 성공! 연습하면 더 잘할 수 있어!', min: 0 },
};

export const ROOMS = [
  // ═══════════════════════════════════════
  // ROOM 1: 용의 금고실 — 큰 수
  // ═══════════════════════════════════════
  {
    id: 1,
    name: '용의 금고실',
    emoji: '🐉',
    unit: '큰 수',
    color: '#e74c3c',
    accent: '#ff6b4a',
    bg: 'linear-gradient(180deg, #1a0a0a 0%, #2d1515 60%, #3a1a12 100%)',
    floorColor: '#2a1810',
    wallDeco: '🕯️',
    objects: [
      {
        id: 'book', emoji: '📚', label: '먼지 낀 책',
        x: 12, y: 28, size: 44,
        type: 'clue',
        dialog: [
          '📚 낡은 책에 이렇게 적혀 있다:',
          '"숫자의 위치가 곧 힘이다.\n같은 5라도 만의 자리와\n백만의 자리는 전혀 다르다..."',
          '"금고를 열려면 4개의\n마법 문양을 모아야 한다."'
        ]
      },
      {
        id: 'coins', emoji: '🪙', label: '동전 더미',
        x: 20, y: 58, size: 48,
        type: 'math',
        runeLabel: '문양 ①',
        problems: [
          {
            q: '이 동전은 총 35,000,000개!\n숫자 5가 나타내는 값은?',
            c: ['5,000', '50,000', '500,000', '5,000,000'],
            a: 3,
            e: '5는 백만의 자리 → 5,000,000'
          }
        ]
      },
      {
        id: 'scroll', emoji: '📜', label: '낡은 두루마리',
        x: 75, y: 30, size: 42,
        type: 'math',
        runeLabel: '문양 ②',
        problems: [
          {
            q: '두루마리에 적힌 수 중\n가장 큰 것은?',
            c: ['9,874,300', '9,847,300', '9,873,400', '9,874,030'],
            a: 0,
            e: '높은 자리부터 비교 → 9,874,300'
          }
        ]
      },
      {
        id: 'gem', emoji: '💎', label: '보석함',
        x: 55, y: 55, size: 44,
        type: 'math',
        runeLabel: '문양 ③',
        problems: [
          {
            q: '보석함에 적힌 글:\n"삼억 이천오백사십만"\n숫자로 쓰면?',
            c: ['32,540,000', '325,400,000', '3,254,000', '300,254,000'],
            a: 1,
            e: '3억 + 2,540만 = 325,400,000'
          }
        ]
      },
      {
        id: 'jar', emoji: '🏺', label: '깨진 항아리',
        x: 85, y: 62, size: 44,
        type: 'math',
        runeLabel: '문양 ④',
        problems: [
          {
            q: '항아리 조각에 적힌 수열:\n3000만→4000만→(  )→6000만\n빈칸에 알맞은 수는?',
            c: ['4500만', '5000만', '5500만', '7000만'],
            a: 1,
            e: '1000만씩 뛰어세기 → 5000만'
          }
        ]
      },
      {
        id: 'npc', emoji: '🐲', label: '두리',
        x: 40, y: 68, size: 56,
        type: 'npc',
        name: '두리',
        greeting: [
          '으앙~ 나는 아기 용 두리야!',
          '금고 암호를 까먹었어… 😢\n방 안의 물건들을 조사해서\n마법 문양 4개를 모아줘!'
        ],
        hints: {
          0: '방 안의 빛나는 물건들을\n탭해서 조사해봐!',
          1: '잘하고 있어! 문양을 더 모아봐!',
          2: '거의 다 모았어! 조금만 더!',
          3: '하나만 더! 힘내!',
          4: '다 모았어! 금고를 열어봐! 🔐'
        }
      },
      {
        id: 'safe', emoji: '🔐', label: '금고',
        x: 45, y: 22, size: 52,
        type: 'exit',
        requireCount: 4,
        combo: {
          instruction: '마법 문양의 수를 작은 것부터\n큰 순서로 배열하세요!',
          items: ['5000만', '3억2540만', '9874300', '500만'],
          correctOrder: [3, 2, 0, 1],
          // 500만 < 5000만 < 9,874,300 < 3억2540만
          successMsg: '딸깍! 금고가 열렸어! 🎉'
        }
      }
    ],
    clearDialog: [
      '우와아! 금고가 열렸어!! 🎉',
      '고마워! 여기 다음 방 열쇠야!\n별의 관측소로 가봐!'
    ]
  },

  // ═══════════════════════════════════════
  // ROOM 2: 별의 관측소 — 각도
  // ═══════════════════════════════════════
  {
    id: 2,
    name: '별의 관측소',
    emoji: '🔭',
    unit: '각도',
    color: '#3498db',
    accent: '#5dade2',
    bg: 'linear-gradient(180deg, #050510 0%, #0d1b2a 60%, #152238 100%)',
    floorColor: '#121a28',
    wallDeco: '⭐',
    objects: [
      {
        id: 'chart', emoji: '🗺️', label: '별자리 지도',
        x: 15, y: 25, size: 44,
        type: 'clue',
        dialog: [
          '🗺️ 별자리 지도에 적혀 있다:',
          '"예각은 90°보다 작고,\n둔각은 90°보다 크다.\n직각은 정확히 90°."',
          '"포탈을 열려면 별빛 결정 3개를\n올바른 각도 순서로 놓아라."'
        ]
      },
      {
        id: 'telescope', emoji: '🔭', label: '망원경',
        x: 25, y: 52, size: 50,
        type: 'math',
        runeLabel: '별빛결정 ①',
        problems: [
          {
            q: '망원경으로 본 두 별 사이의 각도!\n3시 정각의 시침과 분침이\n이루는 각도와 같다면 몇 도?',
            c: ['60°', '90°', '120°', '180°'],
            a: 1,
            e: '3시 정각 → 시침과 분침 = 90°'
          }
        ]
      },
      {
        id: 'protractor', emoji: '📐', label: '벽의 각도기',
        x: 70, y: 30, size: 44,
        type: 'math',
        runeLabel: '별빛결정 ②',
        problems: [
          {
            q: '각도기에 표시된 135°는\n어떤 종류의 각일까?',
            c: ['예각', '직각', '둔각', '평각'],
            a: 2,
            e: '90°~180° 사이 = 둔각'
          }
        ]
      },
      {
        id: 'laser', emoji: '⚡', label: '레이저 장치',
        x: 55, y: 58, size: 46,
        type: 'math',
        runeLabel: '별빛결정 ③',
        problems: [
          {
            q: '레이저 각도를 맞추자!\n45°와 35°를 합하면?',
            c: ['70°', '75°', '80°', '85°'],
            a: 2,
            e: '45° + 35° = 80°'
          }
        ]
      },
      {
        id: 'npc', emoji: '🦉', label: '달님이',
        x: 85, y: 55, size: 52,
        type: 'npc',
        name: '달님이',
        greeting: [
          '호호, 어서 오거라.',
          '나는 부엉이 박사 달님이란다.\n별빛 결정 3개를 모아\n포탈을 열어보렴!'
        ],
        hints: {
          0: '빛나는 장치들을 조사해보렴.',
          1: '잘하고 있구나! 더 찾아보렴.',
          2: '거의 다 모았어!',
          3: '다 모았구나! 포탈로 가거라!'
        }
      },
      {
        id: 'portal', emoji: '🌀', label: '포탈',
        x: 42, y: 20, size: 52,
        type: 'exit',
        requireCount: 3,
        combo: {
          instruction: '별빛 결정의 각도를\n작은 것부터 큰 순서로!',
          items: ['90°', '135°', '80°'],
          correctOrder: [2, 0, 1],
          // 80° < 90° < 135°
          successMsg: '우웅~ 포탈이 열린다! ✨'
        }
      }
    ],
    clearDialog: [
      '호호! 훌륭하구나! 🌟',
      '포탈이 열렸단다.\n다음 방으로 가거라!'
    ]
  },

  // ═══════════════════════════════════════
  // ROOM 3: 마법사의 연구실 — 곱셈과 나눗셈
  // ═══════════════════════════════════════
  {
    id: 3,
    name: '마법사의 연구실',
    emoji: '🧙',
    unit: '곱셈과 나눗셈',
    color: '#9b59b6',
    accent: '#bb6bd9',
    bg: 'linear-gradient(180deg, #0f0818 0%, #1e0d2b 60%, #261435 100%)',
    floorColor: '#1a0e24',
    wallDeco: '🕯️',
    objects: [
      {
        id: 'recipe', emoji: '📖', label: '레시피북',
        x: 10, y: 30, size: 44,
        type: 'clue',
        dialog: [
          '📖 물약 레시피북:',
          '"탈출 물약 제조법:\n재료 A, B, C를 정확한 양만큼\n가마솥에 넣을 것."',
          '"양을 틀리면 폭발하니 주의!\n곱셈과 나눗셈을 정확히!"'
        ]
      },
      {
        id: 'shelf', emoji: '🧪', label: '재료 선반',
        x: 22, y: 55, size: 46,
        type: 'math',
        runeLabel: '재료 A',
        problems: [
          {
            q: '레시피: "재료 A는 37 × 6만큼"\n정확한 양은?',
            c: ['202', '212', '222', '232'],
            a: 2,
            e: '37×6 = 222'
          }
        ]
      },
      {
        id: 'cauldron', emoji: '🫧', label: '가마솥',
        x: 60, y: 52, size: 50,
        type: 'math',
        runeLabel: '재료 B',
        problems: [
          {
            q: '"576방울을 8번에 나눠 넣어라"\n한 번에 넣을 양은?',
            c: ['62', '72', '82', '68'],
            a: 1,
            e: '576 ÷ 8 = 72'
          }
        ]
      },
      {
        id: 'drawer', emoji: '🗝️', label: '잠긴 서랍',
        x: 82, y: 35, size: 44,
        type: 'math',
        runeLabel: '재료 C',
        problems: [
          {
            q: '서랍 암호: "500 ÷ 7의\n몫과 나머지를 구하라"',
            c: ['몫:70 나머지:10', '몫:71 나머지:3', '몫:72 나머지:4', '몫:71 나머지:2'],
            a: 1,
            e: '71×7=497, 500-497=3'
          }
        ]
      },
      {
        id: 'npc', emoji: '🐈‍⬛', label: '까미',
        x: 40, y: 70, size: 50,
        type: 'npc',
        name: '까미',
        greeting: [
          '냥? 누구냥?',
          '나는 까미다냥!\n재료 3개를 모아서\n탈출 물약을 만들어봐냥!'
        ],
        hints: {
          0: '선반이랑 가마솥을 조사해봐냥!',
          1: '잘하고 있다냥! 더 찾아봐냥!',
          2: '거의 다 모았다냥!',
          3: '다 모았다냥! 가마솥으로 가냥!'
        }
      },
      {
        id: 'door', emoji: '🚪', label: '비밀 통로',
        x: 48, y: 18, size: 50,
        type: 'exit',
        requireCount: 3,
        combo: {
          instruction: '재료를 양이 적은 것부터\n많은 순서로 넣으세요!',
          items: ['222방울', '72방울', '71...나머지3'],
          correctOrder: [2, 1, 0],
          // 71r3 < 72 < 222
          successMsg: '부글부글... 물약 완성! 문이 열린다! 🧪'
        }
      }
    ],
    clearDialog: [
      '오오! 물약이 완성됐다냥!! 🎊',
      '비밀 통로가 열렸다냥!\n마지막 방으로 가라냥!'
    ]
  },

  // ═══════════════════════════════════════
  // ROOM 4: 거울의 미궁 — 평면도형의 이동
  // ═══════════════════════════════════════
  {
    id: 4,
    name: '거울의 미궁',
    emoji: '🪞',
    unit: '평면도형의 이동',
    color: '#1abc9c',
    accent: '#48dbaa',
    bg: 'linear-gradient(180deg, #060f0d 0%, #0d2b25 60%, #123830 100%)',
    floorColor: '#0e2420',
    wallDeco: '✧',
    objects: [
      {
        id: 'tile', emoji: '🟦', label: '바닥 타일',
        x: 15, y: 55, size: 44,
        type: 'clue',
        dialog: [
          '🟦 바닥 타일에 새겨진 글:',
          '"밀기 = 위치만 변한다\n뒤집기 = 좌우/상하가 바뀐다\n돌리기 = 한 점 중심으로 회전"',
          '"세 가지 변환의 결과를 모아\n출구의 잠금을 해제하라."'
        ]
      },
      {
        id: 'mirror_l', emoji: '🪞', label: '왼쪽 거울',
        x: 20, y: 32, size: 48,
        type: 'math',
        runeLabel: '도형조각 ①',
        problems: [
          {
            q: '거울에 비친 문제:\n"삼각형을 밀면\n변하지 않는 것은?"',
            c: ['위치', '크기', '방향', '좌표'],
            a: 1,
            e: '밀기 → 위치만 변하고 크기는 그대로!'
          }
        ]
      },
      {
        id: 'mirror_r', emoji: '🪞', label: '오른쪽 거울',
        x: 78, y: 32, size: 48,
        type: 'math',
        runeLabel: '도형조각 ②',
        problems: [
          {
            q: '거울에 비친 문제:\n"한 직선을 기준으로\n도형을 옮기는 것은?"',
            c: ['밀기', '뒤집기', '돌리기', '늘리기'],
            a: 1,
            e: '대칭축 기준으로 옮기기 = 뒤집기'
          }
        ]
      },
      {
        id: 'spinner', emoji: '🔄', label: '회전판',
        x: 60, y: 60, size: 46,
        type: 'math',
        runeLabel: '도형조각 ③',
        problems: [
          {
            q: '회전판 문제:\n"정사각형을 시계 방향으로\n90° 돌리면 모양은?"',
            c: ['직사각형이 된다', '모양이 같다', '마름모가 된다', '삼각형이 된다'],
            a: 1,
            e: '정사각형은 90° 돌려도 같다!'
          }
        ]
      },
      {
        id: 'npc', emoji: '✨', label: '미러',
        x: 48, y: 72, size: 50,
        type: 'npc',
        name: '미러',
        greeting: [
          '……어서 와.',
          '나는 거울 요정 미러.\n도형 조각 3개를 모아\n출구를 열어.'
        ],
        hints: {
          0: '…거울과 회전판을 조사해봐.',
          1: '…잘하고 있어. 더 찾아봐.',
          2: '…거의 다 모았어.',
          3: '…다 모았군. 출구로 가.'
        }
      },
      {
        id: 'exit_door', emoji: '🚪', label: '출구',
        x: 45, y: 18, size: 52,
        type: 'exit',
        requireCount: 3,
        combo: {
          instruction: '도형 변환을 순서대로!\n밀기 → 뒤집기 → 돌리기',
          items: ['뒤집기 조각', '밀기 조각', '돌리기 조각'],
          correctOrder: [1, 0, 2],
          successMsg: '찰칵! 문이 열린다! 🌈'
        }
      }
    ],
    clearDialog: [
      '…대단해. 모든 문을 열었어. 🌈',
      '현실로 돌아갈 시간이야.\n눈을 감아봐…'
    ]
  }
];
