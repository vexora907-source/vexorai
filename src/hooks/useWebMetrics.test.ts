/// <reference types="vitest/globals" />

import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWebMetrics } from './useWebMetrics';
import { enviarBeaconTelegram } from '../services/telegramService';
import { fetchVisitCount } from '../services/visitCounter';

vi.mock('../services/telegramService', () => ({
  enviarNotificacionTelegram: vi.fn().mockResolvedValue(true),
  enviarBeaconTelegram: vi.fn(),
}));

vi.mock('../services/visitCounter', () => ({
  fetchVisitCount: vi.fn(),
}));

describe('useWebMetrics', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('uses the visit number in the exit alert without waiting for the location lookup', async () => {
    vi.mocked(fetchVisitCount).mockResolvedValue(42);
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => undefined)));

    renderHook(() => useWebMetrics());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      window.dispatchEvent(new Event('pagehide'));
    });

    expect(enviarBeaconTelegram).toHaveBeenCalledWith(expect.stringContaining('Era la visita Nº: *42*'));
  });

  it('sends only one exit alert when both unload events fire', async () => {
    vi.mocked(fetchVisitCount).mockResolvedValue(7);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ json: async () => ({ city: 'Bogotá', country_name: 'Colombia' }) })
    );

    renderHook(() => useWebMetrics());

    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });

    act(() => {
      window.dispatchEvent(new Event('beforeunload'));
      window.dispatchEvent(new Event('pagehide'));
    });

    expect(enviarBeaconTelegram).toHaveBeenCalledTimes(1);
  });
});
