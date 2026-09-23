exports.handler = async (event) => {
  const token = "8851083480:AAG3Q2WejO2p0MpofzTfWCtuG2k_po6Q85E";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const CHANNEL = "https://t.me/ProtidinerKajBD";

  try {
    const body = JSON.parse(event.body || "{}");
    const msg = body.message;
    if (!msg) return {statusCode:200,body:"ok"};

    const chatId = msg.chat.id;
    const name = msg.from.first_name || "User";
    const uid = msg.from.id;

    const text = `স্বাগতম ${name} 🌟\n\n🎉 you are Creat your account successfully\n(আপনার একাউন্ট তৈরি হয়েছে)\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\nYour reffer Link:\n👉 https://t.me/ProtidinerKajBD_bot?start=${uid}\n\n🔊 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n🔥 এখনই শুরু করুন।`;

    // উপরে ২ টা বাটন থাকবে জান
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        chat_id: chatId,
        text: text,
        reply_markup: {
          inline_keyboard: [
            [{text:"💰 ইনকাম শুরু করুন", web_app:{url:APP_URL}}],
            [{text:"📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url:CHANNEL}]
          ]
        }
      })
    });

    // নিচের নীল মেনু বাটন
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        chat_id: chatId,
        text: "👇 মেনু থেকে ইনকাম শুরু করুন",
        reply_markup: {
          keyboard: [[{text:"💰 ইনকাম শুরু করুন", web_app:{url:APP_URL}}]],
          resize_keyboard: true,
          is_persistent: true
        }
      })
    });

    return {statusCode:200,body:"ok"};
  } catch(e){ return {statusCode:200,body:"ok"} }
};
