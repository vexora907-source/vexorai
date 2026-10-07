const TELEGRAM_API_URL = '/api/telegram';

export function buildTelegramPayload(texto: string) {
  return { text: texto };
}

export const enviarNotificacionTelegram = async (texto: string): Promise<boolean> => {
  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildTelegramPayload(texto)),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al enviar mensaje a Telegram:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al conectar con la API interna de Telegram:', error);
    return false;
  }
};

export const enviarBeaconTelegram = (texto: string): void => {
  const payload = JSON.stringify(buildTelegramPayload(texto));

  if (navigator.sendBeacon) {
    const queued = navigator.sendBeacon(
      TELEGRAM_API_URL,
      new Blob([payload], { type: 'application/json' })
    );

    if (queued) {
      return;
    }
  }

  fetch(TELEGRAM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
    keepalive: true,
  }).catch((error) => {
    console.error('Error con fetch fallback de Telegram:', error);
  });
};
