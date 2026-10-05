import { useEffect, useRef } from 'react';
import { enviarNotificacionTelegram, enviarBeaconTelegram } from '../services/telegramService';

export const useWebMetrics = () => {
  const startTimeRef = useRef<number>(Date.now());
  const sessionInfoRef = useRef<{ ubicacion: string; visitaNro: string }>({
    ubicacion: 'Desconocida o filtrada',
    visitaNro: 'N/A',
  });

  useEffect(() => {
    startTimeRef.current = Date.now();

    const registrarEntrada = async () => {
      try {
        const ipRes = await fetch('https://ipapi.co/json/');
        const ipData = await ipRes.json();

        const countRes = await fetch('https://api.countapi.xyz/hit/vexora-ai-portfolio/visits');
        const countData = await countRes.json();

        sessionInfoRef.current = {
          ubicacion: `📍 ${ipData.city || 'Desconocida'}, ${ipData.country_name || 'País no disponible'}`,
          visitaNro: String(countData.value || '1'),
        };

        const mensajeEntrada = `
🌐 *VEXOR AI - NUEVO VISITANTE EN LA WEB*
🔢 Visita acumulada Nº: *${sessionInfoRef.current.visitaNro}*
🗺️ Ubicación: ${sessionInfoRef.current.ubicacion}
⏰ Hora de entrada: ${new Date().toLocaleTimeString()}
        `.trim();

        await enviarNotificacionTelegram(mensajeEntrada);
      } catch (error) {
        console.error('No se pudo registrar la entrada web:', error);
        await enviarNotificacionTelegram(`🌐 *VEXOR AI - NUEVO VISITANTE*\n🗺️ Ubicación/Contador: No disponible (AdBlock o bloqueo de red)`);
      }
    };

    const registrarSalida = () => {
      const totalMili = Date.now() - startTimeRef.current;
      const minutos = Math.floor(totalMili / 60000);
      const segundos = ((totalMili % 60000) / 1000).toFixed(0);
      const tiempoFormateado = `${minutos}m ${segundos}s`;

      const mensajeSalida = `
⏱️ *VEXOR AI - VISITANTE SALIÓ DE LA WEB*
🔢 Era la visita Nº: *${sessionInfoRef.current.visitaNro}*
🗺️ Región: ${sessionInfoRef.current.ubicacion}
⏳ Duración de la sesión: *${tiempoFormateado}*
      `.trim();

      enviarBeaconTelegram(mensajeSalida);
    };

    void registrarEntrada();

    window.addEventListener('beforeunload', registrarSalida);
    window.addEventListener('pagehide', registrarSalida);

    return () => {
      window.removeEventListener('beforeunload', registrarSalida);
      window.removeEventListener('pagehide', registrarSalida);
    };
  }, []);
};
