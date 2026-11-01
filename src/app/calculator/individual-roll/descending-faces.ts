export function updateDescendingFaces(
  faces: readonly (number | null)[],
  index: number,
  value: number,
): (number | null)[] {
  const next = [...faces];
  next[index] = value;
  for (let i = index + 1; i < next.length; i++) {
    if (next[i] === null || next[i]! > next[i - 1]!) next[i] = next[i - 1];
  }
  return next;
}
