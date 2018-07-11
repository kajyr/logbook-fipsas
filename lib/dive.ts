const unique = (list: string[]): string[] => Array.from(new Set(list));

export function buddies(buddyList: string[], divemaster: string): string {
  return unique(buddyList.concat(divemaster))
    .filter((b: string) => !!b && b.trim() !== '')
    .join(', ');
}

export function half_depth_break(maxDepth: number): number | string {
  return maxDepth > 18 ? Math.ceil(maxDepth / 2) + 'm' : '___';
}

export function half_depth_break_time(maxDepth: number): number | string {
  return maxDepth > 18 ? '2.5' : '-';
}

export function bottom_time(diveTime: number, maxDepth: number): number {
  return (
    diveTime - 5 - Math.ceil((maxDepth - 6) / 9) - (maxDepth > 18 ? 2.5 : 0)
  );
}

export function surface_is_calm(surface: string): boolean {
  return ['', 'nessuno', 'normale', 'calmo'].includes(surface.toLowerCase());
}
export function surface_is_mid(surface: string): boolean {
  return ['poco mosso', 'leggero'].includes(surface.toLowerCase());
}
export function surface_is_rough(surface: string): boolean {
  return ['mosso'].includes(surface.toLowerCase());
}

export function emersion_time(maxDepth: number): number {
  return Math.ceil((maxDepth - 6) / 9);
}

export function visibility_is_enough(visibility: string): boolean {
  return ['media'].includes(visibility.toLowerCase());
}
export function visibility_is_good(visibility: string): boolean {
  return ['', 'buona'].includes(visibility.toLowerCase());
}
export function visibility_is_poor(visibility: string): boolean {
  return ['scarsa'].includes(visibility.toLowerCase());
}

export function weather_is_clear(weather: string): boolean {
  return ['sereno', 'sole'].includes(weather.toLowerCase());
}
export function weather_is_cloud(weather: string): boolean {
  return ['foschia', 'nuvoloso'].includes(weather.toLowerCase());
}
export function weather_is_rain(weather: string): boolean {
  return ['pioggia', 'burrasca', 'neve'].includes(weather.toLowerCase());
}

export function current_is_calm(current: string): boolean {
  return ['', 'nessuna'].includes(current.toLowerCase());
}
export function current_is_strong(current: string): boolean {
  return ['TODO: find this'].includes(current.toLowerCase());
}
export function current_is_weak(current: string): boolean {
  return ['media'].includes(current.toLowerCase());
}

export function entry(value: string): string {
  switch (value.toLowerCase()) {
    case 'barca':
    case 'boat':
    case '':
      return 'da barca';
    case 'riva':
      return 'da riva';
    case 'pool':
    case 'piscina':
      return 'piscina';
    default:
      return value;
  }
}

export function water(value: string): string {
  switch (value.toLowerCase()) {
    case 'pool':
    case 'piscina':
      return '';
    case 'fresh water':
      return 'acqua dolce';
    case 'salt':
    case 'salt water':
    case '':
      return 'mare';
    default:
      return value;
  }
}

export function lpad(str: string, pad: string, length: number): string {
  while (str.length < length) {
    str = pad + str;
  }
  return str;
}

export function surfaceInterval(
  isRepetitive: boolean,
  surfIntervalInMinutes: number,
): string {
  if (!isRepetitive) {
    return '-';
  }
  const hours = Math.floor(surfIntervalInMinutes / 60);
  const minutes = surfIntervalInMinutes % 60;
  return `${hours}:${lpad(minutes.toString(), '0', 2)}`;
}
