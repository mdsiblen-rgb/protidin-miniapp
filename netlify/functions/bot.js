exports.handler = async (event) => {
  const token = "8851083480:AAG3Q2WejO2p0MpofzTfWCtuG2k_po6Q85E";
  const adminId = "8807178385";
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";

  try {
    const body = JSON.parse(event.body || "{}");
    
    // Withdraw - তোমার আইডিতে যাবে
    if (body.withdrawRequest) {
      const r = body.withdrawRequest;
      const txt = `💸 নতুন উইথড্র!\n👤 ${r.name}\n💰 ${r.amount} Tk\n📱 ${r.number}\n🆔 ${r.uid}`;
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({chat_id:adminId,text:txt})
      });
      return {statusCode:200,body:"ok"};
    }

    const msg = body.message;
    if (!msg) return {statusCode:200,body:"ok"};
    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "User";
    const fromId = String(msg.from.id);

    // শুধু তোমার মেসেজ, A-ToolsX নাই
    const welcomeText = `স্বাগতম ${firstName} 🌟\n\n🎉 you are Creat your account successfully\n(আপনার একাউন্ট তৈরি হয়েছে)\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\nYour reffer Link:\n👉 https://t.me/ProtidinerKajBD_bot?start=${fromId}\n\n🔊 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n🔥 এখনই শুরু করুন।`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        chat_id:chatId,
        text:welcomeText,
        reply_markup:{
          keyboard:[
            [{text:"💰 ইনকাম শুরু করুন",web_app:{url:APP_URL}}],
            [{text:"📢 পেমেন্ট চ্যানেলে যুক্ত হোন"}]
          ],
          resize_keyboard:true,
          is_persistent:true
        }
      })
    });

    return {statusCode:200,body:"ok"};
  } catch(e){ return {statusCode:200,body:"ok"} }
};
