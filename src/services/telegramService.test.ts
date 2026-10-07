import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildTelegramPayload, enviarNotificacionTelegram } from './telegramService';

describe('telegramService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sends messages to the server-side Telegram proxy without exposing credentials', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200 })
    );

    await expect(enviarNotificacionTelegram('Hola Telegram')).resolves.toBe(true);

    expect(fetchMock).toHaveBeenCalledWith('/api/telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Hola Telegram' }),
    });
  });

  it('returns false when the proxy rejects the message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response('Telegram rejected the message', { status: 500 })
    );
    vi.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(enviarNotificacionTelegram('Hola Telegram')).resolves.toBe(false);
  });

  it('builds a text-only payload for the proxy', () => {
    expect(buildTelegramPayload('Hola *mundo*')).toEqual({ text: 'Hola *mundo*' });
  });
});
