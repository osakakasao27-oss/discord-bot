require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    const regex = /(https?:\/\/(?:www\.)?(tiktok\.com|vt\.tiktok\.com)\/\S+)/;

    const match = message.content.match(regex);

    if (!match) return;

    try {
        await message.reply("⏳ Đang lấy video...");

        const api = `https://www.tikwm.com/api/?url=${encodeURIComponent(match[1])}`;

        const res = await axios.get(api);

        if (!res.data.data.play) {
            return message.reply("❌ Không lấy được video.");
        }

        message.channel.send({
            content: `🎬 ${res.data.data.play}`
        });

    } catch (e) {
        console.log(e);
        message.reply("❌ Lỗi khi lấy video.");
    }
});

client.login(process.env.TOKEN);
