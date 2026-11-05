import { createHmac } from 'node:crypto';
import { afterEach, describe, expect, it, vi } from 'vitest';
import handler from './visits';

function createResponse() {
  return {
    statusCode: 200,
    body: null as unknown,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('/api/visits', () => {
  it('signs the hit request to POS and returns the persisted total', async () => {
    const secret = 'test-crm-integration-secret';
    vi.stubEnv('POS_API_URL', 'https://pos.example/');
    vi.stubEnv('CRM_INTEGRATION_SECRET', secret);
    const fetchMock = vi.fn(async (_url, init) => {
      const timestamp = init?.headers?.['x-crm-timestamp'];
      expect(init?.method).toBe('POST');
      expect(init?.body).toBe('{}');
      expect(init?.headers?.['x-crm-signature']).toBe(
        createHmac('sha256', secret).update(`${timestamp}.`).update('{}').digest('hex'),
      );
      return { ok: true, json: async () => ({ value: 125 }) };
    });
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await handler({ method: 'POST' }, response);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ value: 125 });
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0][0].toString()).toBe(
      'https://pos.example/api/internal/crm/website-visits/hit',
    );
  });

  it('rejects methods other than POST', async () => {
    const response = createResponse();

    await handler({ method: 'GET' }, response);

    expect(response.statusCode).toBe(405);
  });
});
