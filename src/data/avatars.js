const N = null;

// ── Kai ──────────────────────────────────────────────────
const K_SK = '#7B4F2E'; // dark brown skin
const K_HR = '#1a0800'; // black hair
const K_EY = '#ffffff'; // eye white
const K_MO = '#5a2a10'; // mouth
const K_SH = '#E8732A'; // orange shirt
const K_TR = '#2A9D8F'; // teal trousers
const K_BT = '#1a1a1a'; // black shoes

// ── Zara ─────────────────────────────────────────────────
const Z_SK = '#7B4F2E'; // dark brown skin
const Z_HR = '#1a0800'; // black hair
const Z_EY = '#ffffff'; // eye white
const Z_MO = '#5a2a10'; // mouth
const Z_DR = '#D4A017'; // mustard dress
const Z_LG = '#5a3010'; // brown legs
const Z_BT = '#1a1a1a'; // black shoes

// ── Max ──────────────────────────────────────────────────
const M_SK = '#FFD6AA'; // light skin
const M_HR = '#7B4A1E'; // brown hair
const M_EY = '#333333'; // dark eyes
const M_SH = '#222222'; // black shirt
const M_CO = '#ffffff'; // white collar
const M_TI = '#3B82F6'; // blue tie
const M_JN = '#1D4ED8'; // blue jeans
const M_BT = '#1a1a1a'; // black shoes

// ── Luna ─────────────────────────────────────────────────
const L_SK = '#FFD6AA'; // light skin
const L_HR = '#7B1C1C'; // dark red/maroon hair
const L_EY = '#333333'; // dark eyes
const L_MO = '#cc8866'; // mouth
const L_TO = '#9333EA'; // purple top
const L_BK = '#111111'; // black skirt
const L_PU = '#7C3AED'; // purple shoes

export const avatars = [
  {
    id: 1,
    name: 'KAI',
    desc: 'The Explorer',
    color: '#E8732A',
    grid: [
      [N,    N,    K_HR, K_HR, K_HR, K_HR, K_HR, K_HR, N,    N   ], // 0  afro top
      [N,    K_HR, K_HR, K_HR, K_HR, K_HR, K_HR, K_HR, K_HR, N   ], // 1  afro
      [K_HR, K_HR, K_SK, K_SK, K_SK, K_SK, K_SK, K_SK, K_HR, K_HR], // 2  face + afro sides
      [N,    K_HR, K_SK, K_EY, K_SK, K_SK, K_EY, K_SK, K_HR, N   ], // 3  eyes
      [N,    K_HR, K_SK, K_SK, K_SK, K_SK, K_SK, K_SK, K_HR, N   ], // 4  nose
      [N,    N,    K_SK, K_SK, K_MO, K_MO, K_SK, K_SK, N,    N   ], // 5  mouth
      [N,    N,    N,    K_SK, K_SK, K_SK, K_SK, N,    N,    N   ], // 6  neck
      [N,    K_SH, K_SH, K_SH, K_SK, K_SK, K_SH, K_SH, K_SH, N  ], // 7  shoulders
      [N,    K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, N  ], // 8  shirt
      [N,    K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, N  ], // 9  shirt
      [N,    K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, K_SH, N  ], // 10 shirt bottom
      [N,    K_TR, K_TR, K_TR, N,    N,    K_TR, K_TR, K_TR, N   ], // 11 legs
      [N,    K_TR, K_TR, K_TR, N,    N,    K_TR, K_TR, K_TR, N   ], // 12 legs
      [N,    K_TR, K_TR, K_TR, N,    N,    K_TR, K_TR, K_TR, N   ], // 13 legs
      [N,    K_BT, K_BT, K_BT, N,    N,    K_BT, K_BT, K_BT, N  ], // 14 shoes
    ],
  },
  {
    id: 2,
    name: 'ZARA',
    desc: 'The Wanderer',
    color: '#D4A017',
    grid: [
      [N,    N,    Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, N,    N   ], // 0  hair top
      [N,    Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, Z_HR, N   ], // 1  hair
      [N,    Z_HR, Z_SK, Z_SK, Z_SK, Z_SK, Z_SK, Z_SK, Z_HR, N   ], // 2  face
      [N,    Z_HR, Z_SK, Z_EY, Z_SK, Z_SK, Z_EY, Z_SK, Z_HR, N   ], // 3  eyes
      [N,    Z_HR, Z_SK, Z_SK, Z_SK, Z_SK, Z_SK, Z_SK, Z_HR, N   ], // 4  nose
      [N,    N,    Z_SK, Z_SK, Z_MO, Z_MO, Z_SK, Z_SK, N,    N   ], // 5  mouth
      [N,    N,    N,    Z_SK, Z_SK, Z_SK, Z_SK, N,    N,    N   ], // 6  neck
      [N,    Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, N   ], // 7  dress top
      [N,    Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, N   ], // 8  dress
      [Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR], // 9  dress flared
      [Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR, Z_DR], // 10 dress hem
      [N,    N,    Z_LG, Z_LG, N,    N,    Z_LG, Z_LG, N,    N   ], // 11 legs
      [N,    N,    Z_LG, Z_LG, N,    N,    Z_LG, Z_LG, N,    N   ], // 12 legs
      [N,    N,    Z_LG, Z_LG, N,    N,    Z_LG, Z_LG, N,    N   ], // 13 legs
      [N,    N,    Z_BT, Z_BT, N,    N,    Z_BT, Z_BT, N,    N   ], // 14 shoes
    ],
  },
  {
    id: 3,
    name: 'MAX',
    desc: 'The Tactician',
    color: '#3B82F6',
    grid: [
      [N,    N,    M_HR, M_HR, M_HR, M_HR, M_HR, M_HR, N,    N   ], // 0  hair
      [N,    M_HR, M_HR, M_HR, M_HR, M_HR, M_HR, M_HR, M_HR, N   ], // 1  hair
      [N,    M_HR, M_SK, M_SK, M_SK, M_SK, M_SK, M_SK, M_HR, N   ], // 2  face
      [N,    N,    M_SK, M_EY, M_SK, M_SK, M_EY, M_SK, N,    N   ], // 3  eyes
      [N,    N,    M_SK, M_SK, M_SK, M_SK, M_SK, M_SK, N,    N   ], // 4  nose
      [N,    N,    M_SK, M_SK, M_SK, M_SK, M_SK, M_SK, N,    N   ], // 5  mouth/chin
      [N,    N,    N,    M_SK, M_SK, M_SK, M_SK, N,    N,    N   ], // 6  neck
      [N,    M_SH, M_CO, M_CO, M_TI, M_TI, M_CO, M_CO, M_SH, N  ], // 7  collar + tie
      [N,    M_SH, M_SH, M_SH, M_TI, M_TI, M_SH, M_SH, M_SH, N  ], // 8  shirt + tie
      [N,    M_SH, M_SH, M_SH, M_TI, M_SH, M_SH, M_SH, M_SH, N  ], // 9  shirt + tie end
      [N,    M_SH, M_SH, M_SH, M_SH, M_SH, M_SH, M_SH, M_SH, N  ], // 10 shirt bottom
      [N,    M_JN, M_JN, M_JN, N,    N,    M_JN, M_JN, M_JN, N   ], // 11 jeans
      [N,    M_JN, M_JN, M_JN, N,    N,    M_JN, M_JN, M_JN, N   ], // 12 jeans
      [N,    M_JN, M_JN, M_JN, N,    N,    M_JN, M_JN, M_JN, N   ], // 13 jeans
      [N,    M_BT, M_BT, M_BT, N,    N,    M_BT, M_BT, M_BT, N   ], // 14 shoes
    ],
  },
  {
    id: 4,
    name: 'LUNA',
    desc: 'The Mystic',
    color: '#9333EA',
    grid: [
      [N,    L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, N   ], // 0  hair wide
      [L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR, L_HR], // 1  hair full
      [L_HR, L_HR, L_SK, L_SK, L_SK, L_SK, L_SK, L_SK, L_HR, L_HR], // 2  face + hair sides
      [L_HR, L_HR, L_SK, L_EY, L_SK, L_SK, L_EY, L_SK, L_HR, L_HR], // 3  eyes
      [L_HR, N,    L_SK, L_SK, L_SK, L_SK, L_SK, L_SK, N,    L_HR], // 4  nose
      [N,    N,    L_SK, L_SK, L_MO, L_MO, L_SK, L_SK, N,    N   ], // 5  mouth
      [N,    N,    N,    L_SK, L_SK, L_SK, L_SK, N,    N,    N   ], // 6  neck
      [N,    L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, N   ], // 7  purple top
      [N,    L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, N   ], // 8  top
      [N,    L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, L_TO, N   ], // 9  top bottom
      [N,    L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, N  ], // 10 black skirt
      [N,    L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, L_BK, N  ], // 11 skirt
      [N,    N,    L_SK, L_SK, N,    N,    L_SK, L_SK, N,    N   ], // 12 legs
      [N,    N,    L_SK, L_SK, N,    N,    L_SK, L_SK, N,    N   ], // 13 legs
      [N,    N,    L_PU, L_PU, N,    N,    L_PU, L_PU, N,    N   ], // 14 purple shoes
    ],
  },
];
