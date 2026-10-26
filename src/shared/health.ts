export const HEALTH_PATH = "/api/health";

export type HealthResponse = {
  ok: true;
};

export function healthBody(): HealthResponse {
  return { ok: true };
}
