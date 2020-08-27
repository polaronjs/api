export function buildPath(...segments: string[]) {
  return segments
    .filter((x) => !!x)
    .join('/')
    .replace(/\/{2,}/gi, '/');
}
