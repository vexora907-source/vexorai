/// <reference types="vitest/globals" />

import { act, render, screen, fireEvent } from '@testing-library/react';
import { useEffect } from 'react';
import App from './App';
import { vi } from 'vitest';

const enviarMensajeFormulario = vi.fn();

vi.mock('./components/common/WelcomeSplash', () => ({
  WelcomeSplash: ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
    useEffect(() => {
      onAnimationComplete();
    }, [onAnimationComplete]);

    return <div>Welcome splash</div>;
  },
}));

vi.mock('./features/contacto/hooks/useContacto', () => ({
  useContacto: () => ({
    enviarMensajeFormulario,
    loading: false,
    success: false,
    error: '',
  }),
}));

vi.mock('./hooks/useWebMetrics', () => ({
  useWebMetrics: () => ({
    ubicacion: 'Bogotá, Colombia',
  }),
}));

describe('App contact form', () => {
  beforeEach(() => {
    enviarMensajeFormulario.mockClear();
    enviarMensajeFormulario.mockResolvedValue(true);
  });

  it('includes an email field in the contact form', () => {
    render(<App />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('submits the email with the rest of the contact data', async () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@email.com' } });
    fireEvent.change(screen.getByLabelText(/número de contacto/i), { target: { value: '+57 300 000 0000' } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: 'Colombia' } });
    fireEvent.change(screen.getByLabelText(/describe tu proyecto/i), { target: { value: 'Necesito una app' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('form', { name: /formulario de contacto/i }));
      await Promise.resolve();
    });

    expect(enviarMensajeFormulario).toHaveBeenCalledWith('Ana', '+57 300 000 0000', 'Colombia', 'Necesito una app', 'ana@email.com');
  });

  it('keeps the form data when sending fails', async () => {
    enviarMensajeFormulario.mockResolvedValue(false);
    render(<App />);

    const nameInput = screen.getByLabelText(/nombre/i);
    fireEvent.change(nameInput, { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@email.com' } });
    fireEvent.change(screen.getByLabelText(/número de contacto/i), { target: { value: '+57 300 000 0000' } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: 'Colombia' } });
    fireEvent.change(screen.getByLabelText(/describe tu proyecto/i), { target: { value: 'Necesito una app' } });
    await act(async () => {
      fireEvent.submit(screen.getByRole('form', { name: /formulario de contacto/i }));
      await Promise.resolve();
    });

    expect(nameInput).toHaveValue('Ana');
  });
});
