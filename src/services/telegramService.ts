export type TelegramEnvValues = Partial<Record<'VITE_TELEGRAM_BOT_TOKEN' | 'VITE_TELEGRAM_CHAT_ID', string>>;

export type TelegramConfig = {
  botToken: string;
  chatId: string;
  apiUrl: string;
};

export function getTelegramConfig(env: TelegramEnvValues = import.meta.env): TelegramConfig | null {
  const botToken = (env.VITE_TELEGRAM_BOT_TOKEN ?? '').trim();
  const chatId = (env.VITE_TELEGRAM_CHAT_ID ?? '').trim();

  if (!botToken || !chatId) {
    return null;
  }

  return {
    botToken,
    chatId,
    apiUrl: `https://api.telegram.org/bot${botToken}/sendMessage`,
  };
}

export function buildTelegramPayload(texto: string, chatId: string) {
  return {
    chat_id: chatId,
    text: texto,
  };
}

export const isTelegramConfigured = Boolean(getTelegramConfig());

const getConfiguredTelegramConfig = (): TelegramConfig | null => {
  const config = getTelegramConfig();

  if (!config) {
    console.warn(
      'Telegram no está configurado. Define VITE_TELEGRAM_BOT_TOKEN y VITE_TELEGRAM_CHAT_ID en Vercel o en tu archivo .env.local.'
    );
  }

  return config;
};

export const enviarNotificacionTelegram = async (texto: string): Promise<boolean> => {
  const config = getConfiguredTelegramConfig();

  if (!config) {
    return false;
  }

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildTelegramPayload(texto, config.chatId)),
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
  const config = getConfiguredTelegramConfig();

  if (!config) {
    return;
  }

  const payload = JSON.stringify(buildTelegramPayload(texto, config.chatId));

  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      config.apiUrl,
      new Blob([payload], { type: 'application/json' })
    );
    return;
  }

  fetch(config.apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload,
  }).catch((error) => {
    console.error('Error con fetch fallback de Telegram:', error);
  });
};
