exports.handler = async (event) => {
  const token = "8851083480:AAG3Q2WejO2p0MpofzTfWCtuG2k_po6Q85E";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";

  try {
    const body = JSON.parse(event.body || "{}");
    const msg = body.message;
    if (!msg) return {statusCode:200,body:"ok"};

    const chatId = msg.chat.id;
    const name = msg.from.first_name || "User";
    const uid = msg.from.id;

    const welcomeText = `স্বাগতম  ${name}  🌟\n\n🎉 you are Creat your account successfully\n(আপনার একাউন্ট তৈরি হয়েছে)\n\n🚀 নিচের  ইনকাম শুরু করুন  বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\nYour reffer Link:\n👉 https://t.me/${BOT_USERNAME}?start=${uid}\n\n📢 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n🔥 এখনই শুরু করুন আর আপনার ভালো সময় উপভোগ করুন।\n\n${PAYMENT_CHANNEL}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        chat_id: chatId,
        text: welcomeText,
        disable_web_page_preview: false,
        reply_markup: {
          inline_keyboard: [
            [{text:"💰 ইনকাম শুরু করুন", web_app:{url:APP_URL}}],
            [{text:"📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url:PAYMENT_CHANNEL}]
          ]
        }
      })
    });

    return {statusCode:200,body:"ok"};
  } catch(e){ return {statusCode:200,body:"ok"} }
};
