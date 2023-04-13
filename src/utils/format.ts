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

export function getFormattedAddress(address: string, size = 6) {
  return `${address.slice(0, size)}...${address.slice(-(size - 2))}`;
}

export function getEmojiForWalletType(type: string) {
  switch (type) {
    case 'hot':
      return '🔥';
    case 'cold':
      return '🥶';
    case 'vault':
      return '🔒';
    default:
      return '';
  }
}
