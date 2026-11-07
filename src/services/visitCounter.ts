export type VisitCountResponse = {
  value?: number | string;
};

const POS_API_URL = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://backend-vexora-pos-jkc6.vercel.app' : '');

export function normalizeVisitValue(data: VisitCountResponse = {}): number {
  const rawValue = data.value;

  if (typeof rawValue === 'number' && Number.isSafeInteger(rawValue) && rawValue >= 0) {
    return rawValue;
  }

  if (typeof rawValue === 'string') {
    const parsed = Number(rawValue);
    if (Number.isSafeInteger(parsed) && parsed >= 0) {
      return parsed;
    }
  }

  throw new Error('El contador de visitas devolvió un valor no válido.');
}

let visitCountRequest: Promise<number> | undefined;

export function fetchVisitCount(fetcher: typeof fetch = fetch): Promise<number> {
  if (!visitCountRequest) {
    const url = new URL('/api/public/metrics/visits', POS_API_URL || window.location.origin).toString();
    visitCountRequest = fetcher(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`No se pudo registrar la visita (${response.status}).`);
        }
        return normalizeVisitValue((await response.json()) as VisitCountResponse);
      })
      .catch((error: unknown) => {
        visitCountRequest = undefined;
        throw error;
      });
  }

  return visitCountRequest;
}
