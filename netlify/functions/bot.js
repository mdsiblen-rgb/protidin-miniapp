exports.handler = async (event) => {
  // তোমার টোকেন আর আইডি ভিতরেই বসানো জান
  const token = process.env.BOT_TOKEN || "8851083480:AAG3Q2WejO2p0MpofzTfWCtuG2k_po6Q85E";
  const adminId = String(process.env.ADMIN_ID || "8807178385");
  const botUsername = process.env.BOT_USERNAME || "ProtidinerKaj_BD_Bot";
  const FIREBASE_URL = "https://protidin-kaj-default-rtdb.firebaseio.com";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";

  try {
    const body = JSON.parse(event.body || "{}");

    // 1. উইথড্র রিকোয়েস্ট - সরাসরি তোমার 8807178385 তে যাবে জান
    if (body.withdrawRequest) {
      const r = body.withdrawRequest;
      const text = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${r.name}\n🆔 UID: ${r.uid}\n💰 টাকা: ${r.amount} Tk\n💳 মেথড: ${r.method}\n📱 নাম্বার: ${r.number}\n⏰ সময়: ${r.time}\n\nFirebase > withdraws এ গিয়ে Approve করো!`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: adminId, text: text })
      });
      return { statusCode: 200, body: "ok" };
    }

    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };
    const chatId = msg.chat.id;
    const fromId = String(msg.from.id || "");
    const firstName = msg.from.first_name || "User";
    const text = (msg.text || "").trim();

    if (text.startsWith("/start")) {
      const welcomeText = `স্বাগতম ${firstName} 🌟\n\n🎉 you are Creat your account successfully\n(আপনার একাউন্ট তৈরি হয়েছে)\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\nYour reffer Link:\n👉 https://t.me/${botUsername}?start=${fromId}\n\n🔊 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n🔥 এখনই শুরু করুন আর আপনার ভালো সময় উপভোগ করুন।`;

      // উপরের ২ টা বাটন (Inline)
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeText,
          reply_markup: {
            inline_keyboard: [
              [{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }],
              [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: PAYMENT_CHANNEL }]
            ]
          }
        })
      });

      // নিচের নীল বাটন (Reply Keyboard) - এটা তোমার ছবির নিচেরটা জান
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "👇 নিচের বাটনে ক্লিক করে ইনকাম শুরু করুন 👇",
          reply_markup: {
            keyboard: [
              [{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }],
              [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন" }]
            ],
            resize_keyboard: true,
            is_persistent: true
          }
        })
      });

    } else if (text === "💰 ইনকাম শুরু করুন" || text === "📢 পেমেন্ট চ্যানেলে যুক্ত হোন") {
      if (text.includes("পেমেন্ট")) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: `আমাদের পেমেন্ট চ্যানেল:\n${PAYMENT_CHANNEL}`, reply_markup: { inline_keyboard: [[{ text: "📢 Join Channel", url: PAYMENT_CHANNEL }]] } })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: `🚀 ইনকাম শুরু করুন:\n${APP_URL}`, reply_markup: { inline_keyboard: [[{ text: "💰 Open App", web_app: { url: APP_URL } }]] } })
        });
      }
    } else if (text.startsWith("/balance")) {
      let realBalance = 0;
      try {
        const r = await fetch(`${FIREBASE_URL}/users/tg_${fromId}/bal.json`);
        const d = await r.json();
        if (d !== null) realBalance = d;
      } catch (e) {}
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `💰 ${firstName} আপনার ব্যালেন্স: ${Number(realBalance).toFixed(2)} টাকা`,
          reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }]] }
        })
      });
    }

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    return { statusCode: 200, body: "ok" };
  }
};
