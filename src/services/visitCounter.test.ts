import { describe, expect, it } from 'vitest';
import { normalizeVisitValue } from './visitCounter';

describe('visitCounter', () => {
  it('normalizes the counter value returned by countapi', () => {
    expect(normalizeVisitValue({ value: 128 })).toBe(128);
    expect(normalizeVisitValue({ value: undefined })).toBe(1);
    expect(normalizeVisitValue({ value: '42' as unknown as number })).toBe(42);
  });
});
