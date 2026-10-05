import { describe, expect, it } from 'vitest';
import { buildTelegramPayload, getTelegramConfig } from './telegramService';

describe('telegramService config', () => {
  it('uses the internal proxy endpoint required in production', () => {
    const config = getTelegramConfig({
      VITE_TELEGRAM_BOT_TOKEN: 'token123',
      VITE_TELEGRAM_CHAT_ID: 'chat456',
    });

    expect(config).toEqual({
      botToken: 'token123',
      chatId: 'chat456',
      apiUrl: '/api/telegram',
    });
  });

  it('builds a payload that can be sent to the proxy', () => {
    const payload = buildTelegramPayload('Hola *mundo*', 'chat456');

    expect(payload).toMatchObject({
      chat_id: 'chat456',
      text: 'Hola *mundo*',
    });
    expect(payload).not.toHaveProperty('parse_mode');
  });
});
