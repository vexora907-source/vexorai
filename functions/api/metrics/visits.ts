interface MetricsEnvironment {
  METRICS_KV: KVNamespace;
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

export const onRequestPost = async (context: EventContext<MetricsEnvironment, string, Record<string, unknown>>) => {
  try {
    const kv = context.env.METRICS_KV;

    if (!kv) {
      return Response.json({ ok: false, error: 'Visit counter is not configured.' }, {
        status: 500,
        headers: corsHeaders,
      });
    }

    const currentValue = await kv.get('vexoraia:visits');
    const current = currentValue ? Number.parseInt(currentValue, 10) : 0;
    const safeCurrent = Number.isSafeInteger(current) && current >= 0 ? current : 0;
    const next = safeCurrent + 1;

    await kv.put('vexoraia:visits', String(next));

    return Response.json({ ok: true, value: next }, {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('Visit counter Pages Function error:', error);
    return Response.json({ ok: false, error: 'No se pudo registrar la visita.' }, {
      status: 500,
      headers: corsHeaders,
    });
  }
};
