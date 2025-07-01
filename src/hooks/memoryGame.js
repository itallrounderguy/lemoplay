//memoryGames.js

export const GAME_URL = 'https://learnifylevels.s3.us-east-1.amazonaws.com/memorycards/index.html';
export const GAME_ORIGIN = new URL(GAME_URL).origin;

export const ANIMATION_IFRAME_URL =
  'https://learnify2025.s3.us-east-1.amazonaws.com/spineanimations/playbuttun/lemo_playbuttun.html?animation=wait&scale=1.2';

export const ANIMATION_ORIGIN = 'https://learnify2025.s3.us-east-1.amazonaws.com';

export const DIFFICULTY_LEVELS = [
  { label: '🐣 Baby', rows: 2, cols: 2 },
  { label: '🧒 Learner', rows: 2, cols: 3 },
  { label: '🧠 Smart', rows: 2, cols: 4 },
  { label: '🤯 Genius', rows: 3, cols: 4 },
  { label: '👽 Alien', rows: 4, cols: 4 },
];
