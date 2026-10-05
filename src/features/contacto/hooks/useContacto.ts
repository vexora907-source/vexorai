import { useState } from 'react';
import { enviarNotificacionTelegram } from '../../../services/telegramService';

export const useContacto = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const enviarMensajeFormulario = async (
    nombre: string,
    telefono: string,
    pais: string,
    mensaje: string,
    correo: string
  ) => {
    setLoading(true);
    setSuccess(false);

    const textoMensaje = `
📥 *NUEVO CONTACTO DESDE VEXOR AI*
👤 Nombre: *${nombre}*
📧 Correo: *${correo}*
📱 Teléfono: *${telefono}*
🌍 País: *${pais}*
💬 Proyecto:
"${mensaje}"
    `.trim();

    const resultado = await enviarNotificacionTelegram(textoMensaje);

    if (resultado) {
      setSuccess(true);
    }

    setLoading(false);
  };

  return { enviarMensajeFormulario, loading, success };
};
