export type VisitCountResponse = {
  value?: number | string;
};

export function normalizeVisitValue(data: VisitCountResponse = {}): number {
  const rawValue = data.value;

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    return rawValue;
  }

  if (typeof rawValue === 'string') {
    const parsed = Number(rawValue);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 1;
}

export async function fetchVisitCount(): Promise<number> {
  try {
    const response = await fetch('https://api.countapi.xyz/hit/vexora-ai-portfolio/visits');

    if (!response.ok) {
      throw new Error(`Error al consultar el contador: ${response.status}`);
    }

    const data = (await response.json()) as VisitCountResponse;
    return normalizeVisitValue(data);
  } catch (error) {
    console.error('No se pudo obtener el contador de visitas:', error);
    return 1;
  }
}
