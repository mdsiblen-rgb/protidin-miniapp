export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BOT_TOKEN;
  const ADMIN_ID = String(process.env.ADMIN_ID || "8807178385");
  const APP_URL = "https://protidin-miniapp.vercel.app";
  const FIREBASE_URL = process.env.FIREBASE_URL || "https://protidin-mini-app-default-rtdb.firebaseio.com";

  try {
    const body = req.body || {};

    // 1. Withdraw থেকে মেসেজ আসলে
    if (body.action === "withdraw") {
      const { uid, name, amount, method, number } = body;
      // | দিয়ে ভাগ করলাম, যাতে _ থাকলেও সমস্যা না হয়
      const approveData = `AP|${uid}|${amount}`;
      const declineData = `DC|${uid}|${amount}`;
      const text = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${name}\n🆔 UID: ${uid}\n💰 পরিমাণ: ${amount} Tk\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n⏰ সময়: ${new Date().toLocaleString("bn-BD")}`;
      
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          chat_id: ADMIN_ID, text,
          reply_markup: { inline_keyboard: [[ { text: "✅ Approve", callback_data: approveData }, { text: "❌ Decline", callback_data: declineData } ]] }
        })
      });
      return res.status(200).json({ ok: true });
    }

    // 2. Approve / Decline বাটনে ক্লিক করলে
    if (body.callback_query) {
      const cb = body.callback_query;
      if (String(cb.from.id) !== ADMIN_ID) return res.status(200).send("ok");
      
      const data = cb.data || "";
      const [type, uid, amount] = data.split("|");
      const isApprove = type === "AP";

      // Telegram এ লোডিং শেষ করা
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: isApprove ? "Approved ✅" : "Declined ❌" })
      });

      // ইউজারকে মেসেজ দেওয়া + Firebase এ স্ট্যাটাস আপডেট
      try {
        const userChatId = uid.replace("user_", "").replace(/[^0-9]/g,""); // যদি uid থেকে chat id বের করা যায়
        // Firebase এ approve লেখা
        if (FIREBASE_URL) {
           await fetch(`${FIREBASE_URL}/withdraws/${uid}.json`, { method: "PATCH", body: JSON.stringify({ status: isApprove ? "approved" : "declined", amount }) });
        }
      } catch(e){}

      // আগের মেসেজটা এডিট করে Done লেখা
      const newText = cb.message.text + `\n\n${isApprove ? "✅ Approved" : "❌ Declined"} by Admin`;
      await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ADMIN_ID, message_id: cb.message.message_id, text: newText })
      });

      return res.status(200).send("ok");
    }

    if (body.message) {
      const chatId = body.message.chat.id;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `স্বাগতম 🌟 ID: ${chatId}`, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }]] } })
      });
    }
    return res.status(200).send("ok");
  } catch(e){ return res.status(200).send("ok"); }
}
