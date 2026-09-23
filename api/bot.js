export default async function handler(req, res) { 
  const TOKEN = "8851083480:AAG1P_nehHtarP_D2_NP5EiLVLSD7hD6uk4"; 
  const APP_URL = "https://protidin-miniapp.vercel.app"; 
  try { 
    const update = req.body; 
    if (!update.message) return res.status(200).send("ok"); 
    const chatId = update.message.chat.id; 
    const text = update.message.text; 
    if (text === "/start") { 
      await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, { 
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: "প্রতিদিন - Mini App এ স্বাগতম! 👇 নিচের বাটনে ক্লিক করুন", 
          reply_markup: { 
            inline_keyboard: [ 
              [{ text: "🚀 App ওপেন করুন", web_app: { url: APP_URL } }] 
            ] 
          } 
        }) 
      }); 
    } 
    return res.status(200).send("ok"); 
  } catch (e) { 
    return res.status(200).send("ok"); 
  } 
}
