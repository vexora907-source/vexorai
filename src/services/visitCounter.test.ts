import { describe, expect, it, vi } from 'vitest';
import { fetchVisitCount, normalizeVisitValue } from './visitCounter';

describe('visitCounter', () => {
  it('normalizes a valid counter value', () => {
    expect(normalizeVisitValue({ value: 128 })).toBe(128);
    expect(normalizeVisitValue({ value: '42' })).toBe(42);
  });

  it('rejects invalid totals rather than fabricating a visit count', () => {
    expect(() => normalizeVisitValue({ value: undefined })).toThrow(/valor no válido/);
    expect(() => normalizeVisitValue({ value: -1 })).toThrow(/valor no válido/);
    expect(() => normalizeVisitValue({ value: 1.5 })).toThrow(/valor no válido/);
  });

  it('records a visit once per page load through the same-origin API', async () => {
    const fetcher = vi.fn(async () => ({
      ok: true,
      json: async () => ({ value: 43 }),
    })) as unknown as typeof fetch;

    await expect(fetchVisitCount(fetcher)).resolves.toBe(43);
    await expect(fetchVisitCount(fetcher)).resolves.toBe(43);
    expect(fetcher).toHaveBeenCalledOnce();
    expect(fetcher).toHaveBeenCalledWith('/api/visits', { method: 'POST' });
  });
});
