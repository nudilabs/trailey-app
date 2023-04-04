export function getEmojiForIndex(index: number) {
  switch (index + 1) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return index + 1;
  }
}
