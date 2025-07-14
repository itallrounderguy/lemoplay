// avatars.js (new file to centralize avatar data)

const avatars = [
  {
    label: 'Char1',
    src: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_1.png',
  },
  {
    label: 'Char2',
    src: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_2.png',
  },
  {
    label: 'Char3',
    src: 'https://learnify2025.s3.us-east-1.amazonaws.com/profiles/char_2.png', // duplicate src intentionally
  },
];

export const avatarMap = avatars.reduce((acc, avatar) => {
  acc[avatar.label] = avatar.src;
  return acc;
}, {});

export default avatars;
