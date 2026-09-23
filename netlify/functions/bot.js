// FINAL FIXED FILE - Protidin Earning BD - By Jan
exports.handler = async (event) => {
  const token = "8851083480:AAG3Q2WejO2p0MpofzTfWCtuG2k_po6Q85E";
  const ADMIN_ID = "8807178385"; // তোমার Admin ID জান
  const APP_URL = "https://protidin-earning-bd.netlify.app";
  const PAYMENT_CHANNEL = "https://t.me/ProtidinerKajBD";
  const BOT_USERNAME = "ProtidinerKajBD_bot";

  try {
    const body = JSON.parse(event.body || "{}");

    // ===== 1. ADMIN APPROVE / DECLINE BUTTON =====
    if (body.callback_query) {
      const cb = body.callback_query;
      const data = cb.data || "";
      const fromId = String(cb.from.id);

      if (fromId!== ADMIN_ID) {
        return { statusCode: 200, body: "ok" };
      }

      const parts = data.split("_");
      const action = parts[0];
      const targetUid = parts[1];
      const amount = parts[2] || "0";

      if (action === "approve") {
        // ইউজারকে জানাও Approve হয়েছে
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: targetUid,
            text: `✅ অভিনন্দন ${targetUid} জান!\n\nআপনার ${amount} Tk Withdraw Approve হয়েছে!\n5-10 মিনিটের মধ্যে পেমেন্ট পেয়ে যাবেন!\n\n📢 চ্যানেল: ${PAYMENT_CHANNEL}`
          })
        });
        // Admin কে জানাও
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_ID,
            text: `✅ Done জান! UID: ${targetUid} এর ${amount} Tk Approve করা হলো!`
          })
        });
      } else if (action === "decline") {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: targetUid,
            text: `❌ দুঃখিত জান! আপনার ${amount} Tk Withdraw Decline করা হয়েছে! Admin এর সাথে যোগাযোগ করুন!`
          })
        });
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: ADMIN_ID,
            text: `❌ UID: ${targetUid} এর Withdraw Decline করা হলো জান!`
          })
        });
      }

      await fetch(`https://api.telegram.org/bot${token}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: cb.id, text: "Done জান!" })
      });

      return { statusCode: 200, body: "ok" };
    }

    // ===== 2. WEB APP থেকে WITHDRAW আসলে =====
    if (body.action === "withdraw") {
      const { uid, name, amount, method, number } = body;

      // Admin কে Approve বাটন সহ পাঠাও
      const adminText = `💸 নতুন উইথড্র জান!\n\n👤 নাম: ${name}\n🆔 UID: ${uid}\n💰 পরিমাণ: ${amount} Tk\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n⏰ সময়: ${new Date().toLocaleString("bn-BD")}\n\nLink: ${APP_URL}`;

      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: ADMIN_ID,
          text: adminText,
          reply_markup: {
            inline_keyboard: [[
              { text: "✅ Approve", callback_data: `approve_${uid}_${amount}` },
              { text: "❌ Decline", callback_data: `decline_${uid}_${amount}` }
            ]]
          }
        })
      });

      // ইউজারকে Pending মেসেজ পাঠাও
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: uid,
          text: `⏳ জান আপনার ${amount} Tk উইথড্র Pending Processing এ আছে!\n\n💳 মেথড: ${method}\n📱 নাম্বার: ${number}\n\n✅ Admin Approve করলে 5-10 মিনিটে পেমেন্ট পাবেন!\n\n📢 ${PAYMENT_CHANNEL}`
        })
      });

      return { statusCode: 200, body: JSON.stringify({ ok: true, status: "pending" }) };
    }

    // ===== 3. NORMAL START / BALANCE / ANY MESSAGE =====
    const msg = body.message;
    if (!msg) return { statusCode: 200, body: "ok" };

    const chatId = msg.chat.id;
    const name = msg.from.first_name || "User";
    const uid = msg.from.id;

    // সব কমান্ডের জন্য একই Reply - কোনো A_ToolsX Force Join নাই
    const welcomeText = `স্বাগতম ${name} 🌟\n\n🎉 আপনার একাউন্ট তৈরি হয়েছে!\n(You are Created your account successfully)\n\n🆔 আপনার ID: ${uid}\n👤 নাম: ${name}\n\n🔗 আপনার রেফার লিংক:\n👉 https://t.me/${BOT_USERNAME}?start=${uid}\n\n🚀 নিচের ইনকাম শুরু করুন বাটনে ক্লিক করে বিজ্ঞাপন দেখা শুরু করুন।\n\n📢 আমাদের অফিসিয়াল পেমেন্ট চ্যানেলে যুক্ত থাকুন।\n\n🔥 এখনই শুরু করুন!\n\n${PAYMENT_CHANNEL}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: welcomeText,
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [{ text: "💰 ইনকাম শুরু করুন", web_app: { url: APP_URL } }],
            [{ text: "📢 পেমেন্ট চ্যানেলে যুক্ত হোন", url: PAYMENT_CHANNEL }]
          ]
        }
      })
    });

    return { statusCode: 200, body: "ok" };
  } catch (e) {
    console.log(e);
    return { statusCode: 200, body: "ok" };
  }
};
