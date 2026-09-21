exports.handler = async (event) => {
  const token = process.env.BOT_TOKEN;
  try {
    const body = JSON.parse(event.body || "{}");
    const chatId = body.message?.chat?.id;
    const text = body.message?.text?.trim() || "";

    if (!chatId) return { statusCode: 200, body: "ok" };

    // /start, /start@botname সবগুলো ধরবে
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
  } catch (e) {
    console.log("Error:", e);
  }
  return { statusCode: 200, body: "ok" };
};
