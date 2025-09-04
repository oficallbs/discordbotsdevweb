const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const TOKEN = process.env.BOT_TOKEN;
const GUILD_ID = process.env.GUILD_ID;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers] });

let guildInfo = { name: "Yükleniyor...", memberCount: 0 };
let botName = "Yükleniyor...";
let serverCount = 0;
let lastServerCount = 0;

client.once('ready', async () => {
    console.log(`Bot hazır: ${client.user.tag}`);
    botName = client.user.username;

    // Ana sunucu bilgisi
    try {
        const guild = await client.guilds.fetch(GUILD_ID);
        await guild.members.fetch();
        guildInfo.name = guild.name;
        guildInfo.memberCount = guild.memberCount;
    } catch (err) {
        console.error("Ana sunucu fetch hatası:", err);
    }

    // Başlangıç sunucu sayısı
    serverCount = client.guilds.cache.size;
    lastServerCount = serverCount;

    // Her 1 saniye sunucu sayısını kontrol et
    setInterval(() => {
        const current = client.guilds.cache.size;
        if(current > lastServerCount){
            console.log(`Yeni sunucuya katıldı! Sunucu sayısı: ${current}`);
        }
        lastServerCount = current;
        serverCount = current;
    }, 1000);
});

client.login(TOKEN);

app.use(express.static('public'));

app.get('/api/stats', (req, res) => {
    res.json({
        botName,
        guildName: guildInfo.name,
        memberCount: guildInfo.memberCount,
        serverCount
    });
});

app.listen(PORT, () => console.log(`Server ${PORT} portunda çalışıyor`));