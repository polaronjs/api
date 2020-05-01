export function buildPath(...segments: string[]) {
  return segments.join('/').replace(/\/{2,}/gi, '/');
}
