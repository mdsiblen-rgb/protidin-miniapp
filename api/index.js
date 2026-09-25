export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BOT_TOKEN;
  const ADMIN_ID = "8807178385";
  const APP_URL = "https://protidin-miniapp.vercel.app";

  const body = req.body || {};

  try {
    // Withdraw
    if (body.action === "withdraw") {
      const { uid, name, amount, method, number } = body;
      const text = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${name}\n🆔 UID: ${uid}\n💰 পরিমাণ: ${amount} Tk\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_ID,
          text: text,
          reply_markup: { inline_keyboard: [[ { text: "✅ Approve", callback_data: "APPROVE_" + uid }, { text: "❌ Decline", callback_data: "DECLINE_" + uid } ]] }
        })
      });
      return res.status(200).json({ ok: true });
    }

    // Approve Button Click
    if (body.callback_query) {
      const cq = body.callback_query;
      const clickId = String(cq.from.id);
      const data = cq.data;
      
      // শুধু তুমি ক্লিক করতে পারবে
      if (clickId !== ADMIN_ID) {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: cq.id, text: "তুমি Admin না!", show_alert: true })
        });
        return res.status(200).send("ok");
      }

      const isApprove = data.startsWith("APPROVE");
      const uid = data.replace("APPROVE_", "").replace("DECLINE_", "");

      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cq.id, text: isApprove ? "Approved Done ✅" : "Declined ❌" })
      });

      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_ID,
          message_id: cq.message.message_id,
          text: cq.message.text + "\n\n" + (isApprove ? "✅ APPROVED by Admin - টাকা পাঠিয়ে দিন" : "❌ DECLINED by Admin"),
          reply_markup: { inline_keyboard: [] }
        })
      });

      return res.status(200).send("ok");
    }

    // /start
    if (body.message) {
      const chatId = body.message.chat.id;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `স্বাগতম ID: ${chatId}`, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }]] } })
      });
    }

    return res.status(200).send("ok");
  } catch (e) {
    console.log(e);
    return res.status(200).send("ok");
  }
}
