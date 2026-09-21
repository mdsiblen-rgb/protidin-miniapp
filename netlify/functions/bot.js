exports.handler = async (event) => {
  const token = process.env.BOT_TOKEN;
  const adminId = String(process.env.ADMIN_ID || "");
  
  try {
    const body = JSON.parse(event.body || "{}");
    const chatId = body.message?.chat?.id;
    const fromId = String(body.message?.from?.id || "");
    const text = body.message?.text?.trim() || "";
    
    if (!chatId) return { statusCode: 200, body: "ok" };

    // /start
    if (text.startsWith("/start")) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "✅ স্বাগতম Protidin Mini App এ!\n\nপ্রতিদিন ইনকাম করতে নিচের বাটনে ক্লিক করুন।",
          reply_markup: {
            inline_keyboard: [
              [{ text: "💰 ইনকাম শুরু করুন", web_app: { url: "https://protidin-miniapp.netlify.app" } }],
              [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: "https://t.me/ProtidinerKajBD" }]
            ]
          }
        })
      });
    }

    // /admin - নতুন যোগ করেছি জান
    if (text.startsWith("/admin")) {
      if (fromId !== adminId) {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "❌ আপনি অ্যাডমিন না! আপনার ID: " + fromId
          })
        });
      } else {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: "✅ অ্যাডমিন প্যানেল রেডি জান!\n\nনিচের বাটনে ক্লিক করুন:",
            reply_markup: {
              inline_keyboard: [
                [{ text: "🔧 Admin Panel খুলুন", web_app: { url: "https://protidin-miniapp.netlify.app/admin.html" } }],
                [{ text: "🌐 সরাসরি ওপেন", url: "https://protidin-miniapp.netlify.app/admin.html" }]
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
