import { useState } from 'react';
import { enviarNotificacionTelegram } from '../../../services/telegramService';

export const useContacto = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const enviarMensajeFormulario = async (
    nombre: string,
    telefono: string,
    pais: string,
    mensaje: string,
    correo: string
  ) => {
    setLoading(true);
    setSuccess(false);
    setError('');

    const textoMensaje = `
📥 *NUEVO CONTACTO DESDE VEXOR AI*
👤 Nombre: *${nombre}*
📧 Correo: *${correo}*
📱 Teléfono: *${telefono}*
🌍 País: *${pais}*
💬 Proyecto:
"${mensaje}"
    `.trim();

    try {
      const resultado = await enviarNotificacionTelegram(textoMensaje);

      if (resultado) {
        setSuccess(true);
        return true;
      }

      setError('No se pudo enviar tu mensaje. Inténtalo de nuevo más tarde.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { enviarMensajeFormulario, loading, success, error };
};
