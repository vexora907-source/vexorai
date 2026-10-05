import { describe, expect, it } from 'vitest';
import { buildTelegramPayload, getTelegramConfig } from './telegramService';

describe('telegramService config', () => {
  it('resolves environment variables from Vite env values', () => {
    const config = getTelegramConfig({
      VITE_TELEGRAM_BOT_TOKEN: 'token123',
      VITE_TELEGRAM_CHAT_ID: 'chat456',
    });

    expect(config).toEqual({
      botToken: 'token123',
      chatId: 'chat456',
      apiUrl: 'https://api.telegram.org/bottoken123/sendMessage',
    });
  });

  it('builds a safe payload without markdown formatting issues', () => {
    const payload = buildTelegramPayload('Hola *mundo*', 'chat456');

    expect(payload).toMatchObject({
      chat_id: 'chat456',
      text: 'Hola *mundo*',
    });
    expect(payload).not.toHaveProperty('parse_mode');
  });
});
