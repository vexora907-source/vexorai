const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '';
const MY_PERSONAL_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

export const isTelegramConfigured = Boolean(TELEGRAM_BOT_TOKEN && MY_PERSONAL_CHAT_ID);

export const enviarNotificacionTelegram = async (texto: string): Promise<boolean> => {
  if (!isTelegramConfigured) {
    console.warn('Telegram no está configurado. Define VITE_TELEGRAM_BOT_TOKEN y VITE_TELEGRAM_CHAT_ID.');
    return false;
  }

  try {
    const response = await fetch(TELEGRAM_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: MY_PERSONAL_CHAT_ID,
        text: texto,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al enviar mensaje a Telegram:', errorText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error al conectar con la API de Telegram:', error);
    return false;
  }
};

export const enviarBeaconTelegram = (texto: string): void => {
  if (!isTelegramConfigured) {
    return;
  }

  const payload = JSON.stringify({
    chat_id: MY_PERSONAL_CHAT_ID,
    text: texto,
    parse_mode: 'Markdown',
  });

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      TELEGRAM_API_URL,
      new Blob([payload], { type: 'application/json' })
    );
    return;
  }

  fetch(TELEGRAM_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  }).catch((error) => {
    console.error('Error con fetch fallback de Telegram:', error);
  });
};
