export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body ?? {};
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const chatId = process.env.TELEGRAM_CHAT_ID || '';
    const botToken = process.env.TELEGRAM_BOT_TOKEN || '';

    if (!botToken) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_BOT_TOKEN in Vercel environment variables.' });
    }

    if (!chatId) {
      return res.status(500).json({ ok: false, error: 'Missing TELEGRAM_CHAT_ID in Vercel environment variables.' });
    }

    if (!text) {
      return res.status(400).json({ ok: false, error: 'Message text is required.' });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    });

    const responseBody = await telegramResponse.text();

    if (!telegramResponse.ok) {
      return res.status(telegramResponse.status).json({
        ok: false,
        error: responseBody,
      });
    }

    return res.status(200).json({ ok: true, data: JSON.parse(responseBody) });
  } catch (error) {
    console.error('Telegram proxy error:', error);
    return res.status(500).json({
      ok: false,
      error: 'No se pudo enviar el mensaje a Telegram.',
    });
  }
}
