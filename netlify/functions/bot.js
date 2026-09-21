
exports.handler = async (event) => {
  const token = process.env.BOT_TOKEN;
  try {
    const body = JSON.parse(event.body || "{}");
    const chatId = body.message?.chat?.id;
    const text = body.message?.text;
    if (!chatId) return { statusCode: 200, body: "ok" };
    if (text === "/start") {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: "Protidin Mini App এ স্বাগতম! নিচের বাটনে টিপ দিন",
          reply_markup: {
            inline_keyboard: [[
              { text: "🚀 Open App", web_app: { url: "https://protidin-miniapp.netlify.app" } }
            ]]
          }
        })
      });
    }
  } catch (e) {}
  return { statusCode: 200, body: "ok" };
};
