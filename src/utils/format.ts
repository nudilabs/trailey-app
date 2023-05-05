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

export function getEthFromWei(wei: number | string | undefined) {
  if (!wei) return '0';
  const value = Number(wei) / 10 ** 18;
  return value.toFixed(4);
}

export function getEthFromGwei(gwei: number | string | undefined) {
  if (!gwei) return '0';
  const value = Number(gwei) / 10 ** 9;
  return value.toFixed(4);
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

export function generateColorFromString(str: string): string {
  const COLOR = [
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'cyan',
    'purple',
    'pink'
  ];
  const SHADE = ['400', '500', '600'];
  let hashCode = 0;
  for (let i = 0; i < str.length; i++) {
    hashCode = str.charCodeAt(i) + ((hashCode << 5) - hashCode);
  }
  const colorOne = COLOR[hashCode % COLOR.length];
  const shadeOne = SHADE[hashCode % SHADE.length];
  const colorTwo = COLOR[(hashCode + 1) % COLOR.length];
  const shadeTwo = SHADE[(hashCode + 1) % SHADE.length];
  return `linear(to-tl,${colorOne}.${shadeOne},${colorTwo}.${shadeTwo})`;
}
