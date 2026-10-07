import { useEffect, useRef } from 'react';
import { enviarNotificacionTelegram, enviarBeaconTelegram } from '../services/telegramService';
import { fetchVisitCount } from '../services/visitCounter';

export const useWebMetrics = () => {
  const startTimeRef = useRef<number>(Date.now());
  const sessionInfoRef = useRef<{ ubicacion: string; visitaNro: string }>({
    ubicacion: 'Desconocida o filtrada',
    visitaNro: 'No disponible',
  });

  useEffect(() => {
    startTimeRef.current = Date.now();

    const numeroVisitaPromise = fetchVisitCount().then((countValue) => {
      const visitNumber = String(countValue || '1');
      sessionInfoRef.current.visitaNro = visitNumber;
      return visitNumber;
    });

    const ubicacionPromise = fetch('https://ipapi.co/json/')
      .then((response) => response.json())
      .then((ipData) => `📍 ${ipData.city || 'Desconocida'}, ${ipData.country_name || 'País no disponible'}`)
      .catch((error) => {
        console.error('No se pudo obtener la ubicación del visitante:', error);
        return 'Desconocida o filtrada';
      });

    const registrarEntrada = async () => {
      const [visitNumber, ubicacion] = await Promise.all([numeroVisitaPromise, ubicacionPromise]);

      sessionInfoRef.current = { ubicacion, visitaNro: visitNumber };

      const mensajeEntrada = `
🌐 *VEXOR AI - NUEVO VISITANTE EN LA WEB*
🔢 Visita acumulada Nº: *${visitNumber}*
🗺️ Ubicación: ${sessionInfoRef.current.ubicacion}
⏰ Hora de entrada: ${new Date().toLocaleTimeString()}
        `.trim();

      await enviarNotificacionTelegram(mensajeEntrada);
    };

    let salidaRegistrada = false;
    const registrarSalida = () => {
      if (salidaRegistrada) return;
      salidaRegistrada = true;

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

  return {
    ubicacion: sessionInfoRef.current.ubicacion,
  };
};
