import type { NutriSessionDetailsResponseDTO } from "@/dtos/nutritionist/session/session-details-response.dto";

const CACHE_TTL = 30_000;

const sessionCache = new Map<
  string,
  { data: NutriSessionDetailsResponseDTO; cachedAt: number }
>();

export const sessionDetailsCache = {
  get(sessionId: string): NutriSessionDetailsResponseDTO | undefined {
    const cached = sessionCache.get(sessionId);

    if (!cached) return undefined;

    if (Date.now() - cached.cachedAt >= CACHE_TTL) {
      sessionCache.delete(sessionId);
      return undefined;
    }

    return cached.data;
  },

  set(session: NutriSessionDetailsResponseDTO): void {
    sessionCache.set(session.sessionId, {
      data: session,
      cachedAt: Date.now(),
    });
  },

  invalidate(sessionId: string): void {
    sessionCache.delete(sessionId);
  },
};
