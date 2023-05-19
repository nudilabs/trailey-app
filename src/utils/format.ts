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

export function getFormattedAddress(address: string | undefined, size = 6) {
  if (!address) return '';
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

export function generateAvatarFromString(str: string): string {
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

const colors = [
  '#FC5C54',
  '#FFD95A',
  '#E95D72',
  '#6A87C8',
  '#5FD0F3',
  '#75C06B',
  '#FFDD86',
  '#5FC6D4',
  '#FF949A',
  '#FF8024',
  '#9BA1A4',
  '#EC66FF',
  '#FF8CBC',
  '#FF9A23',
  '#C5DADB',
  '#A8CE63',
  '#71ABFF',
  '#FFE279',
  '#B6B1B6',
  '#FF6780',
  '#A575FF',
  '#4D82FF',
  '#FFB35A'
] as const;

const avatars = [
  { color: colors[0], emoji: '🌶' },
  { color: colors[1], emoji: '🤑' },
  { color: colors[2], emoji: '🐙' },
  { color: colors[3], emoji: '🫐' },
  { color: colors[4], emoji: '🐳' },
  { color: colors[0], emoji: '🤶' },
  { color: colors[5], emoji: '🌲' },
  { color: colors[6], emoji: '🌞' },
  { color: colors[7], emoji: '🐒' },
  { color: colors[8], emoji: '🐵' },
  { color: colors[9], emoji: '🦊' },
  { color: colors[10], emoji: '🐼' },
  { color: colors[11], emoji: '🦄' },
  { color: colors[12], emoji: '🐷' },
  { color: colors[13], emoji: '🐧' },
  { color: colors[8], emoji: '🦩' },
  { color: colors[14], emoji: '👽' },
  { color: colors[0], emoji: '🎈' },
  { color: colors[8], emoji: '🍉' },
  { color: colors[1], emoji: '🎉' },
  { color: colors[15], emoji: '🐲' },
  { color: colors[16], emoji: '🌎' },
  { color: colors[17], emoji: '🍊' },
  { color: colors[18], emoji: '🐭' },
  { color: colors[19], emoji: '🍣' },
  { color: colors[1], emoji: '🐥' },
  { color: colors[20], emoji: '👾' },
  { color: colors[15], emoji: '🥦' },
  { color: colors[0], emoji: '👹' },
  { color: colors[17], emoji: '🙀' },
  { color: colors[4], emoji: '⛱' },
  { color: colors[21], emoji: '⛵️' },
  { color: colors[17], emoji: '🥳' },
  { color: colors[8], emoji: '🤯' },
  { color: colors[22], emoji: '🤠' }
] as const;

function hashCode(text: string) {
  let hash = 0;
  if (text.length === 0) return hash;
  for (let i = 0; i < text.length; i++) {
    const chr = text.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

export function emojiAvatarForAddress(address: string) {
  const resolvedAddress = typeof address === 'string' ? address : '';
  const avatarIndex = Math.abs(
    hashCode(resolvedAddress.toLowerCase()) % avatars.length
  );
  return avatars[avatarIndex ?? 0];
}

export function formatPrettyNumber(num: number | string, decimals = 2) {
  // Convert num to a number if it's a string
  const numValue = typeof num === 'string' ? parseFloat(num) : num;

  if (numValue >= 1000000) {
    return (numValue / 1000000).toFixed(decimals) + 'm';
  } else if (numValue >= 1000) {
    return (numValue / 1000).toFixed(decimals) + 'k';
  } else {
    return numValue.toFixed(decimals);
  }
}

export function formatDecimals(num: number | undefined | string, decimals = 2) {
  if (num === undefined) {
    return 0; // or undefined, or any other value you prefer
  }
  const numAsNumber = Number(num);
  if (isNaN(numAsNumber)) {
    return 0; // or undefined, or any other value you prefer
  }
  return numAsNumber.toFixed(decimals);
}

export function getColorScheme(percentChange?: number | string): string {
  const numericValue = parseFloat(percentChange as string);

  if (!isNaN(numericValue)) {
    if (numericValue > 0) {
      return 'green';
    } else if (numericValue < 0) {
      return 'red';
    }
  }

  return 'gray';
}
