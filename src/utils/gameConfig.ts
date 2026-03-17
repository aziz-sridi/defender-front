export type gameConfig = {
  mapOptions: { value: string; label: string }[]
  pickTypeOptions: { value: string; label: string }[]
  regionOptions: { value: string; label: string }[]
  spectatorOptions: { value: string; label: string }[]
}

export const DEFAULT_GAME_CONFIG: gameConfig = {
  mapOptions: [],
  pickTypeOptions: [],
  regionOptions: [],
  spectatorOptions: [],
}

export const LeagueOfLegendsConfig: gameConfig = {
  mapOptions: [
    { value: 'summoners-rift', label: "Summoner's Rift" },
    { value: 'howling-abyss', label: 'Howling Abyss' },
    { value: 'twisted-treeline', label: 'Twisted Treeline' },
    { value: 'crystal-scar', label: 'Crystal Scar' },
  ],
  pickTypeOptions: [
    { value: 'draft', label: 'Draft Pick' },
    { value: 'blind', label: 'Blind Pick' },
    { value: 'ranked', label: 'Ranked' },
    { value: 'tournament', label: 'Tournament Draft' },
  ],
  regionOptions: [
    { value: 'na1', label: 'North America' },
    { value: 'euw1', label: 'Europe West' },
    { value: 'eun1', label: 'Europe Nordic & East' },
    { value: 'kr', label: 'Korea' },
    { value: 'jp1', label: 'Japan' },
    { value: 'br1', label: 'Brazil' },
    { value: 'la1', label: 'Latin America North' },
    { value: 'la2', label: 'Latin America South' },
    { value: 'oc1', label: 'Oceania' },
    { value: 'ru', label: 'Russia' },
    { value: 'tr1', label: 'Turkey' },
    { value: 'ph2', label: 'Philippines' },
    { value: 'sg2', label: 'Singapore' },
    { value: 'th2', label: 'Thailand' },
    { value: 'tw2', label: 'Taiwan' },
    { value: 'vn2', label: 'Vietnam' },
    { value: 'cn-ionia', label: 'China - Ionia' },
    { value: 'cn-huya', label: 'China - Huya' },
  ],
  spectatorOptions: [
    { value: 'allowed', label: 'Allowed' },
    { value: 'not-allowed', label: 'Not Allowed' },
    { value: 'lobby-only', label: 'Lobby Only' },
  ],
}

export const ValorantConfig: gameConfig = {
  mapOptions: [
    { value: 'ascent', label: 'Ascent' },
    { value: 'bind', label: 'Bind' },
    { value: 'haven', label: 'Haven' },
    { value: 'split', label: 'Split' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'lotus', label: 'Lotus' },
    { value: 'icebox', label: 'Icebox' },
  ],
  pickTypeOptions: [
    { value: 'deathmatch', label: 'Deathmatch' },
    { value: 'spikerush', label: 'Spike Rush' },
    { value: 'standard', label: 'Standard' },
    { value: 'swiftplay', label: 'Swiftplay' },
    { value: 'escalation', label: 'Escalation' },
    { value: 'replication', label: 'Replication' },
    { value: 'hurm', label: 'Hurm' },
  ],
  regionOptions: [
    { value: 'na', label: 'North America' },
    { value: 'eu', label: 'Europe' },
    { value: 'ap', label: 'Asia Pacific' },
    { value: 'kr', label: 'Korea' },
    { value: 'latam', label: 'Latin America' },
    { value: 'br', label: 'Brazil' },
  ],
  spectatorOptions: [
    { value: 'allowed', label: 'Allowed' },
    { value: 'not-allowed', label: 'Not Allowed' },
    { value: 'lobby-only', label: 'Lobby Only' },
  ],
}

export function getGameConfig(gameName: string): gameConfig {
  switch (gameName.toLowerCase()) {
    case 'league of legends':
    case 'league of legend':
    case 'lol':
      return LeagueOfLegendsConfig
    case 'valorant':
    case 'val':
      return ValorantConfig
    default:
      return DEFAULT_GAME_CONFIG
  }
}
