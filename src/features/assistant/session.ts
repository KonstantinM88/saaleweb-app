/** Standard inactivity boundary for one public assistant conversation. */
export const ASSISTANT_SESSION_IDLE_MS = 30 * 60 * 1000;

export function assistantSessionNow(): number {
  return Date.now();
}
