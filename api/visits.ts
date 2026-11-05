import { createHmac } from 'node:crypto';

const POS_VISIT_HIT_PATH = '/api/internal/crm/website-visits/hit';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const baseUrl = process.env.POS_API_URL?.replace(/\/+$/, '');
  const secret = process.env.CRM_INTEGRATION_SECRET;
  if (!baseUrl || !secret) {
    return res.status(503).json({ error: 'El contador de visitas no está configurado.' });
  }

  let posUrl: URL;
  try {
    posUrl = new URL(POS_VISIT_HIT_PATH, `${baseUrl}/`);
  } catch {
    return res.status(503).json({ error: 'POS_API_URL no contiene una dirección válida.' });
  }

  const localHost = ['localhost', '127.0.0.1', '[::1]'].includes(posUrl.hostname);
  if (posUrl.protocol !== 'https:' && !(posUrl.protocol === 'http:' && localHost)) {
    return res.status(503).json({ error: 'La conexión con Vexora POS debe usar HTTPS.' });
  }

  const body = '{}';
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signature = createHmac('sha256', secret)
    .update(`${timestamp}.`)
    .update(body)
    .digest('hex');

  try {
    const response = await fetch(posUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-crm-timestamp': timestamp,
        'x-crm-signature': signature,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });
    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      console.error('Error al registrar visita en POS:', { status: response.status });
      return res.status(response.status >= 500 ? 502 : response.status).json({
        error: 'No se pudo registrar la visita.',
      });
    }

    if (!Number.isSafeInteger(payload?.value) || payload.value < 0) {
      console.error('POS devolvió un contador de visitas no válido.');
      return res.status(502).json({ error: 'El contador de visitas devolvió una respuesta no válida.' });
    }

    return res.status(200).json({ value: payload.value });
  } catch (error) {
    console.error('No se pudo conectar con POS para registrar la visita:', error);
    return res.status(502).json({ error: 'No se pudo conectar con el contador de visitas.' });
  }
}
