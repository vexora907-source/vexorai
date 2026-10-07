# Vexoraia

Mi portafolio empresarial — preparado para desplegar en Vercel.

Deploy:

1. Crear repo en GitHub llamado `Vexoraia`.
2. Conectar remoto y push:

```bash
git remote add origin git@github.com:<tu_usuario>/Vexoraia.git
git branch -M main
git push -u origin main
```

3. Conectar el repo en Vercel o usar `vercel` CLI.

Build & dev:

```bash
npm install
npm run dev
npm run build
```

Telegram notifications:

- Configure `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` as server-side environment variables in Vercel.
- Do not use the `VITE_` prefix for these credentials; the browser sends notifications through `/api/telegram` and must not receive the bot token.
