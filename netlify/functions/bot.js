exports.handler = async (event) => {
  const token = process.env.BOT_TOKEN;
  const adminId = String(process.env.ADMIN_ID || "");
  const botUsername = process.env.BOT_USERNAME || "ProtidinerKaj_BD_Bot";
  const FIREBASE_URL = "https://protidin-kaj-default-rtdb.firebaseio.com";

  try {
    const body = JSON.parse(event.body || "{}");
    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };

    const chatId = msg.chat.id;
    const fromId = String(msg.from.id || "");
    const firstName = msg.from.first_name || "User";
    const text = (msg.text || "").trim();

    if (text.startsWith("/start")) {
      const welcomeText = `স্বাগতম ${firstName} 🌟\n\n` + `🎉 you are Creat your account successfully\n` + `(আপনার একাউন্ট তৈরি হয়েছে)\n\n` + `🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে\n` + `বিজ্ঞাপন দেখা শুরু করুন।\n` + `Your reffer Link:\n` + `👉 https://t.me/${botUsername}?start=${fromId}\n\n` + `🔊 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n` + `🔥 এখনই শুরু করুন আর আপনার ভালো সময় উপভোগ করুন।`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: welcomeText, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: "https://dailyworkbd.netlify.app" } }], [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: "https://t.me/ProtidinerKajBD" }]] } })
      });
    }
    else if (text.startsWith("/balance")) {
      let realBalance = 0;
      try {
        const r = await fetch(`${FIREBASE_URL}/users/tg_${fromId}/bal.json`);
        const d = await r.json();
        if (d !== null && d !== undefined) realBalance = d;
      } catch(e) {}
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `💰 ${firstName} আপনার ব্যালেন্স:\n\n${Number(realBalance).toFixed(2)} টাকা\n\nআরো ইনকাম করতে নিচের বাটনে ক্লিক করুন! 🚀`, reply_markup: { inline_keyboard: [[{ text: "💰 ইনকাম শুরু করুন", web_app: { url: "https://dailyworkbd.netlify.app" } }]] } })
      });
    }
    else if (text.startsWith("/daily_bonus")) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `🎁 ডেইলি বোনাস নিতে নিচের বাটনে ক্লিক করুন ${firstName}!`, reply_markup: { inline_keyboard: [[{ text: "🎁 বোনাস নিন", web_app: { url: "https://dailyworkbd.netlify.app" } }]] } })
      });
    }
    else if (text.startsWith("/community_task")) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `📢 কমিউনিটি টাস্ক কমপ্লিট করুন এবং বোনাস জিতুন!`, reply_markup: { inline_keyboard: [[{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: "https://t.me/ProtidinerKajBD" }]] } })
      });
    }
    else if (text.startsWith("/refer_link")) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: `🔗 আপনার রেফার লিংক:\n👉 https://t.me/${botUsername}?start=${fromId}\n\nপ্রতি রেফারে 10% কমিশন পাবেন!` })
      });
    }
    else if (text.startsWith("/admin")) {
      if (fromId !== adminId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: "❌ আপনি অ্যাডমিন না!" }) });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, text: "✅ অ্যাডমিন প্যানেল!", reply_markup: { inline_keyboard: [[{ text: "🔧 Admin Panel খুলুন", web_app: { url: "https://dailyworkbd.netlify.app/admin.html" } }]] } }) });
      }
    }

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    return { statusCode: 200, body: "error" };
  }
};
