export const maps = { 10: 'The Twisted Treeline', 11: "Summoner's Rift", 12: 'Howling Abyss' }

export const gameModes = {
  0: {
    type: 'Custom',
    name: 'Custom Game',
  },
  900: {
    type: 'Normal',
    name: 'ARURF',
  },
  450: {
    type: 'Normal',
    name: 'ARAM',
  },
  400: {
    type: 'Normal',
    name: 'DRAFT',
  },
  420: {
    type: 'Ranked',
    name: 'Solo/Duo',
  },
  430: {
    type: 'Normal',
    name: 'BLIND',
  },
  440: {
    type: 'Ranked',
    name: 'FLEX',
  },
  460: {
    type: 'Normal',
    name: 'BLIND 3vs3',
  },
  470: {
    type: 'Ranked',
    name: 'FLEX 3vs3',
  },
  490: {
    type: 'Normal',
    name: 'QUICKPLAY',
  },
  700: {
    type: 'Ranked',
    name: 'CLASH',
  },
  720: {
    type: 'Ranked',
    name: 'CLASH ARAM',
  },
  800: {
    type: 'Bot',
    name: '3vs3 Co-op vs. AI (Intermediate)',
  },
  810: {
    type: 'Bot',
    name: '3vs3 Co-op vs. AI (Intro)',
  },
  820: {
    type: 'Bot',
    name: '3vs3 Co-op vs. AI (Beginner)',
  },
  830: {
    type: 'Bot',
    name: 'Co-op vs. AI (Intro)',
  },
  840: {
    type: 'Bot',
    name: 'Co-op vs. AI (Beginner)',
  },
  850: {
    type: 'Bot',
    name: 'Co-op vs. AI (Intermediate)',
  },
  920: {
    type: 'Normal',
    name: 'PORO KING',
  },
  1020: {
    type: 'Normal',
    name: 'One for All',
  },
  1300: {
    type: 'Normal',
    name: 'Nexus Blitz',
  },
  1400: {
    type: 'Normal',
    name: 'Ultimate Spellbook',
  },
  1900: {
    type: 'Normal',
    name: 'URF',
  },
}

/* ========= OLD 5 COLORS ========= */
// KILLS, KP : green -> 71, 132, 116
// DEATHS, DMGCHAMP, DMGOBJ: red -> 156, 71, 109
// ASSISTS, GOLD, DMGTAKEN: golden -> 146, 100, 79
// MINIONS: purple -> 140, 101, 182
// VISION: blue -> 55, 118, 179

const colorValues = {
  green: '54,148,109',
  red: '197,85,93',
  purple: '141,116,217',
  teal: '104,186,191',
  yellow: '166,176,134',
  orange: '184,137,101',
  brown: '161,127,134',
  blue: '55, 118, 179',
}

export const colors = {
  // match-details
  kills: colorValues['green'],
  deaths: colorValues['red'],
  assists: colorValues['purple'],
  minions: colorValues['teal'],
  vision: colorValues['yellow'],
  gold: colorValues['orange'],
  dmgChamp: colorValues['red'],
  dmgObj: colorValues['yellow'],
  dmgTaken: colorValues['red'],
  kp: colorValues['brown'],

  // champions
  winrate: colorValues['green'],
  playrate: colorValues['purple'],
  wins: colorValues['green'],
  count: colorValues['purple'],
  kda: colorValues['blue'],
  gameLength: colorValues['green'],
}
