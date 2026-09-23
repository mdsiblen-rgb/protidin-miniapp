// FINAL FIXED FILE - Protidin Earning BD - By Jan - NEW TOKEN
exports.handler = async (event) => {
  const token = "8851083480:AAG1P_nehHtarP_D2_NP5EiLVLSD7hD6uk4";
  const ADMIN_ID = "8807178385";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";
  const FIREBASE_URL = "https://protidin-earning-bd-default-rtdb.firebaseio.com";

  try {
    const body = JSON.parse(event.body || "{}");

    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || "";
      const fromId = String(cb.from.id);
      if (fromId!== ADMIN_ID) return { statusCode: 200, body: "ok" };

      const parts = data.split("_");
      const action = parts[0];
      const targetUid = parts[1];
      const amount = parts[2] || "0";

      try {
        await fetch(`${FIREBASE_URL}/withdraws/${targetUid}.json`, {
          method: "PATCH",
          body: JSON.stringify({ status: action === "approve"? "approved" : "rejected" })
        });
      } catch(e){}

      if (action === "approve") {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `✅ অভিনন্দন জান! আপনার ${amount} Tk Approve হয়েছে!` })
        });
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: ADMIN_ID, text: `✅ Done জান! UID: ${targetUid} এর ${amount} Tk Approve হলো!` })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `❌ দুঃখিত জান! আপনার ${amount} Tk Decline করা হয়েছে!` })
        });
      }
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: "Done জান!" })
      });
      return { statusCode: 200, body: "ok" };
    }

    if (body.action === "withdraw") {
      const { uid, name, amount, method, number } = body;
      const adminText = `💸 নতুন উইথড্র জান!\n\n👤 ${name}\n🆔 ${uid}\n💰 ${amount} Tk\n💳 ${method}\n📱 ${number}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_ID, text: adminText,
          reply_markup: { inline_keyboard: [[
            { text: "✅ Approve", callback_data: `approve_${uid}_${amount}` },
            { text: "❌ Decline", callback_data: `decline_${uid}_${amount}` }
          ]]}
        })
      });
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: uid, text: `⏳ জান আপনার ${amount} Tk Pending Processing এ আছে!` })
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true, status: "pending" }) };
    }

    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "User";
    const welcomeText = `স্বাগতম ${name} 🌟\nID: ${msg.from.id}\n\n💰 ইনকাম শুরু করুন!`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: welcomeText, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }]] } })
    });
    return { statusCode: 200, body: "ok" };
  } catch (e) { return { statusCode: 200, body: "ok" }; }
};
