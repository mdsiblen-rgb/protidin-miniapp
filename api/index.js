// FINAL A to Z - Protidin Earning BD - By Jan ❤️ - FIXED ONE TIME
export default async function handler(req, res) {
  const token = process.env.BOT_TOKEN;
  const ADMIN_ID = "8807178385";
  const APP_URL = "https://protidin-miniapp.vercel.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";
  const FIREBASE_URL = "https://protidin-earning-bd-default-rtdb.firebaseio.com";

  try {
    const body = req.body || {};
    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || "";
      const fromId = String(cb.from.id);
      if (fromId !== ADMIN_ID) { return res.status(200).send("ok"); }

      // 1. বার বার Approve বন্ধ - যদি আগেই Edit হয়ে থাকে
      if (cb.message.text.includes("APPROVED") || cb.message.text.includes("DECLINED") || cb.message.text.includes("Done জান!")) {
        await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callback_query_id: cb.id, text: "⛔ এটা আগেই Done করা হয়েছে জান!", show_alert: true })
        });
        return res.status(200).send("ok");
      }

      // 2. UID FIX - split("_") বাদ দিয়ে indexOf দিয়ে ভাঙা
      const first = data.indexOf("_");
      const last = data.lastIndexOf("_");
      const action = data.slice(0, first);
      const targetUid = data.slice(first + 1, last);
      const amount = data.slice(last + 1) || "0";

      try {
        await fetch(`${FIREBASE_URL}/withdraws/${targetUid}.json`, {
          method: "PATCH", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action === "approve" ? "approved" : "rejected", approvedAt: new Date().toISOString() })
        });
      } catch (e) { console.log("Firebase error", e); }

      if (action === "approve") {
        // User কে মেসেজ
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `✅ অভিনন্দন জান!\n\nআপনার ${amount} Tk Withdraw Approve হয়েছে!\n5-10 মিনিটের মধ্যে পেমেন্ট পেয়ে যাবেন!\n\n📢 ${PAYMENT_CHANNEL}` })
        });
        // Admin এর মেসেজ Edit করে বাটন গায়েব
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: ADMIN_ID, 
            message_id: cb.message.message_id, 
            text: cb.message.text + `\n\n✅ APPROVED ${amount} Tk - UID: ${targetUid}\n⏰ ${new Date().toLocaleString("bn-BD")}`, 
            reply_markup: { inline_keyboard: [] } 
          })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `❌ দুঃখিত জান! আপনার ${amount} Tk Withdraw Decline করা হয়েছে!` })
        });
        await fetch(`https://api.telegram.org/bot${token}/editMessageText`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            chat_id: ADMIN_ID, 
            message_id: cb.message.message_id, 
            text: cb.message.text + `\n\n❌ DECLINED - UID: ${targetUid} - ${amount} Tk`, 
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
      const adminText = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${name}\n🆔 UID: ${uid}\n💰 পরিমাণ: ${amount} Tk\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n⏰ সময়: ${new Date().toLocaleString("bn-BD")}`;
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
