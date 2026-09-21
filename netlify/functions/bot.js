exports.handler = async (event) => {
  const token = process.env.BOT_TOKEN;
  const adminId = String(process.env.ADMIN_ID || "");
  const botUsername = process.env.BOT_USERNAME || "ProtidinerKajBD_bot"; // তোমার বটের username @ ছাড়া দাও জান

  try {
    const body = JSON.parse(event.body || "{}");
    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };

    const chatId = msg.chat.id;
    const fromId = String(msg.from.id || "");
    const firstName = msg.from.first_name || "User";
    const text = (msg.text || "").trim();

    if (text.startsWith("/start")) {
      // রেফারেল ID বের করা
      const parts = text.split(" ");
      const refId = parts[1] || "";

      // এখানে চাইলে রেফারেল ডাটাবেসে সেভ করতে পারো জান

      const welcomeText = `স্বাগতম ${firstName} 🌟\n\n` +
        `🎉 you are Creat your account successfully\n` +
        `(আপনার একাউন্ট তৈরি হয়েছে)\n\n` +
        `🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে\n` +
        `বিজ্ঞাপন দেখা শুরু করুন।\n` +
        `Your reffer Link:\n` +
        `👉 https://t.me/${botUsername}?start=${fromId}\n\n` +
        `🔊 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n` +
        `🔥 এখনই শুরু করুন আর আপনার ভালো সময় উপভোগ করুন।`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: welcomeText,
          reply_markup: {
            inline_keyboard: [
              [{ text: "💰 ইনকাম শুরু করুন", web_app: { url: "https://dailyworkbd.netlify.app" } }],
              [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: "https://t.me/ProtidinerKajBD" }]
            ]
          }
        })
      });
    }

    // /admin
    if (text.startsWith("/admin")) {
      if (fromId!== adminId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ chat_id: chatId, text: "❌ আপনি অ্যাডমিন না! ID: " + fromId })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "✅ অ্যাডমিন প্যানেল রেডি জান!",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔧 Admin Panel খুলুন", web_app: { url: "https://dailyworkbd.netlify.app/admin.html" } }]
              ]
            }
          })
        });
      }
    }

  } catch (e) {
    console.log("Error:", e);
  }
  return { statusCode: 200, body: "ok" };
};
