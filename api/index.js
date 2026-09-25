// FINAL A to Z - Protidin Earning BD - By Jan ❤️ - BD TIME 100% FIXED
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = process.env.BOT_TOKEN;
  const ADMIN_ID = "8807178385";
  const APP_URL = "https://protidin-miniapp.vercel.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";
  const FIREBASE_URL = "https://protidin-earning-bd-default-rtdb.firebaseio.com";

  // বাংলাদেশী টাইম 100% FIX - হাতে UTC+6 যোগ
  const bdTime = () => {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const bdDate = new Date(utcTime + (6 * 60 * 60 * 1000));
    return bdDate.toLocaleString("bn-BD", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  };

  try {
    const body = req.body || {};

    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || "";
      const fromId = String(cb.from.id);
      if (fromId !== ADMIN_ID) return res.status(200).send("ok");

      if (cb.message.text.includes("APPROVED") || cb.message.text.includes("DECLINED")) {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: cb.id, text: "⛔ এটা আগেই Done করা হয়েছে জান!", show_alert: true })
        });
        return res.status(200).send("ok");
      }

      const first = data.indexOf("_");
      const last = data.lastIndexOf("_");
      const action = data.slice(0, first);
      const targetUid = data.slice(first + 1, last);
      const amount = data.slice(last + 1) || "0";
      const timeNow = bdTime();

      try {
        await fetch(`${FIREBASE_URL}/withdraws/${targetUid}.json`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected", approvedAt: timeNow, amount: amount })
        });
      } catch (e) { console.log("Firebase error", e); }

      if (action === "approve") {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `✅ অভিনন্দন জান!\n\nআপনার ${amount} Tk Withdraw Approve হয়েছে!\n⏰ সময়: ${timeNow}\n5-10 মিনিটের মধ্যে পেমেন্ট পেয়ে যাবেন!\n\n📢 ${PAYMENT_CHANNEL}` })
        });
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_ID,
            message_id: cb.message.message_id,
            text: cb.message.text + `\n\n✅ APPROVED ${amount} Tk - UID: ${targetUid}\n⏰ ${timeNow}`,
            reply_markup: { inline_keyboard: [] }
          })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `❌ দুঃখিত জান! আপনার ${amount} Tk Withdraw Decline করা হয়েছে!\n⏰ ${timeNow}` })
        });
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_ID,
            message_id: cb.message.message_id,
            text: cb.message.text + `\n\n❌ DECLINED - UID: ${targetUid} - ${amount} Tk\n⏰ ${timeNow}`,
            reply_markup: { inline_keyboard: [] }
          })
        });
      }

      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: "Done জান! ❤️" })
      });
      return res.status(200).send("ok");
    }

    if (body.action === "withdraw") {
      const { uid, name, amount, method, number } = body;
      const adminText = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${name}\n🆔 UID: ${uid}\n💰 পরিমাণ: ${amount} Tk\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n⏰ সময়: ${bdTime()}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_ID, text: adminText,
          reply_markup: { inline_keyboard: [[ { text: "✅ Approve", callback_data: `approve_${uid}_${amount}` }, { text: "❌ Decline", callback_data: `decline_${uid}_${amount}` } ]] }
        })
      });
      return res.status(200).json({ ok: true, status: "pending" });
    }

    const msg = body.message;
    if (!msg) return res.status(200).send("ok");
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";
    const welcomeText = `স্বাগতম ${firstName} 🌟\n\n🎉 আপনার একাউন্ট তৈরি হয়েছে!\n\n🆔 আপনার ID: ${chatId}\n👤 নাম: ${firstName}\n\n🔗 আপনার রেফার লিংক:\n👉 https://t.me/${BOT_USERNAME}?start=${chatId}\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\n\n📢 ${PAYMENT_CHANNEL}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId, text: welcomeText, disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }], [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: PAYMENT_CHANNEL }]]
        }
      })
    });
    return res.status(200).send("ok");
  } catch (e) { console.log(e); return res.status(200).send("ok"); }
}
