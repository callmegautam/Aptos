export function generateRoomCode(): string {
  const part = Math.random()
    .toString(36)
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 8);
  return `ROOM-${part}`;
}
