interface TelegramEnvironment {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export const onRequestOptions = async () => new Response(null, {
  status: 204,
  headers: corsHeaders,
});

export const onRequestPost = async (context: EventContext<TelegramEnvironment, string, Record<string, unknown>>) => {
  try {
    const body = await context.request.text();
    const payload = body ? JSON.parse(body) as { text?: unknown } : {};
    const text = typeof payload.text === 'string' ? payload.text.trim() : '';

    if (!text) {
      return Response.json({ ok: false, error: 'Message text is required.' }, {
        status: 400,
        headers: corsHeaders,
      });
    }

    const botToken = context.env.TELEGRAM_BOT_TOKEN;
    const chatId = context.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return Response.json({ ok: false, error: 'Missing Telegram secrets.' }, {
        status: 500,
        headers: corsHeaders,
      });
    }

    const telegramResponse = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    const responseBody = await telegramResponse.text();

    if (!telegramResponse.ok) {
      return Response.json({ ok: false, error: responseBody }, {
        status: telegramResponse.status,
        headers: corsHeaders,
      });
    }

    return Response.json({ ok: true, data: JSON.parse(responseBody) }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Telegram Pages Function error:', error);
    return Response.json({ ok: false, error: 'No se pudo enviar el mensaje a Telegram.' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
};
