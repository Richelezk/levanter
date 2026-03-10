// plugins/autoviewstatus.js - Toggle auto view status on/off

const { bot } = global; // ou adapte selon le style de Levanter (regarde un autre .js dans plugins/)

let autoView = process.env.AUTO_STATUS_VIEW === 'true' || false;

bot(
  {
    pattern: 'autoview ?(.*)',
    fromMe: true,           // seulement toi (le proprio du bot)
    desc: 'Active/désactive la vue auto des statuts (stories)',
  },
  async (m, text) => {
    const arg = (text || '').trim().toLowerCase();

    if (!arg || !['on', 'off'].includes(arg)) {
      return await m.reply(
        `État actuel : ${autoView ? 'ON ✅' : 'OFF ❌'}\n\n` +
        `Utilise : .autoview on  ou  .autoview off`
      );
    }

    autoView = arg === 'on';
    process.env.AUTO_STATUS_VIEW = autoView ? 'true' : 'false';

    await m.reply(`Auto-view statuts : ${autoView ? 'ACTIVÉ ✅' : 'DÉSACTIVÉ ❌'}`);
  }
);

// Hook pour marquer les statuts comme vus automatiquement (si pas déjà dans le core)
global.sock?.ev?.on('messages.upsert', async ({ messages }) => {
  const msg = messages[0];
  if (msg?.key?.remoteJid === 'status@broadcast' && autoView && !msg.key.fromMe) {
    console.log(`[AUTO-VIEW] Statut vu de ${msg.pushName || 'inconnu'}`);
    // Si besoin de forcer la lecture : await global.sock?.readMessages([msg.key]);
  }
});
