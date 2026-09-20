const { Telegraf, Markup } = require('telegraf');
const admin = require('firebase-admin');
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
  });
}
const db = admin.firestore();
const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start(async (ctx) => {
  const uid = String(ctx.from.id);
  await db.collection('users').doc(uid).set({ id: uid, username: ctx.from.username || '', first_name: ctx.from.first_name || '', joinedAt: new Date() }, { merge: true });
  return ctx.reply(`আসসালামু আলাইকুম ${ctx.from.first_name}!\nProtidiner Kaj BD তে স্বাগতম ✅`, Markup.inlineKeyboard([[Markup.button.webApp('💼 কাজ দেখুন', process.env.MINI_APP_URL)], [Markup.button.url('📢 পেমেন্ট চ্যানেলে যুক্ত থাকুন','https://t.me/protidinerkajbd')]]));
});
exports.handler = async (event) => {
  try { await bot.handleUpdate(JSON.parse(event.body)); } catch(e){ console.log(e); }
  return { statusCode: 200, body: '' };
};
