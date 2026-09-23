// FINAL FIXED FILE - Protidin Earning BD - By Jan - Firebase Added + New Token
exports.handler = async (event) => {
  const token = "8851083480:AAG1P_nehHtarP_D2_NP5EiLVLSD7hD6uk4";
  const ADMIN_ID = "8807178385";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";
  const FIREBASE_URL = "https://protidin-earning-bd-default-rtdb.firebaseio.com";

  try {
    const body = JSON.parse(event.body || "{}");

    // ===== 1. ADMIN APPROVE / DECLINE =====
    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || "";
      const fromId = String(cb.from.id);
      if (fromId!== ADMIN_ID) return { statusCode: 200, body: "ok" };

      const parts = data.split("_");
      const action = parts[0];
      const targetUid = parts[1];
      const amount = parts[2] || "0";

      // 🔥 এইটাই FIX জান - Firebase এ Status Update হবে
      try {
        await fetch(`${FIREBASE_URL}/withdraws/${targetUid}.json`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: action === "approve"? "approved" : "rejected" })
        });
      } catch (e) { console.log("Firebase error", e); }

      if (action === "approve") {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `✅ অভিনন্দন জান!\n\nআপনার ${amount} Tk Withdraw Approve হয়েছে!\n5-10 মিনিটের মধ্যে পেমেন্ট পেয়ে যাবেন!\n\n📢 ${PAYMENT_CHANNEL}` })
        });
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: ADMIN_ID, text: `✅ Done জান! UID: ${targetUid} এর ${amount} Tk Approve করা হলো! App এও Approved দেখাবে!` })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: targetUid, text: `❌ দুঃখিত জান! আপনার ${amount} Tk Withdraw Decline করা হয়েছে!` })
        });
      }
      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: "Done জান!" })
      });
      return { statusCode: 200, body: "ok" };
    }

    // ===== 2. WEB APP থেকে WITHDRAW =====
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
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: uid, text: `⏳ জান আপনার ${amount} Tk উইথড্র Pending Processing এ আছে!\n\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n\n✅ Admin Approve করলে 5-10 মিনিটে পেমেন্ট পাবেন!` })
      });
      return { statusCode: 200, body: JSON.stringify({ ok: true, status: "pending" }) };
    }

    // ===== 3. START MESSAGE =====
    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };
    const chatId = msg.chat.id;
    const name = msg.from.first_name || "User";
    const welcomeText = `স্বাগতম ${name} 🌟\n\n🎉 আপনার একাউন্ট তৈরি হয়েছে!\n\n🆔 আপনার ID: ${msg.chat.id}\n👤 নাম: ${name}\n\n🔗 আপনার রেফার লিংক:\n👉 https://t.me/${BOT_USERNAME}?start=${msg.chat.id}\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\n\n📢 ${PAYMENT_CHANNEL}`;
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: welcomeText, disable_web_page_preview: true, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }], [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: PAYMENT_CHANNEL }]] } })
    });
    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.log(e);
    return { statusCode: 200, body: "ok" };
  }
};
