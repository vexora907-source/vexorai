/// <reference types="vitest/globals" />

import { render, screen, fireEvent } from '@testing-library/react';
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
  });

  it('includes an email field in the contact form', () => {
    render(<App />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('submits the email with the rest of the contact data', () => {
    render(<App />);

    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), { target: { value: 'ana@email.com' } });
    fireEvent.change(screen.getByLabelText(/número de contacto/i), { target: { value: '+57 300 000 0000' } });
    fireEvent.change(screen.getByLabelText(/país/i), { target: { value: 'Colombia' } });
    fireEvent.change(screen.getByLabelText(/describe tu proyecto/i), { target: { value: 'Necesito una app' } });
    fireEvent.click(screen.getByRole('button', { name: /enviar/i }));

    expect(enviarMensajeFormulario).toHaveBeenCalledWith('Ana', '+57 300 000 0000', 'Colombia', 'Necesito una app', 'ana@email.com');
  });
});
