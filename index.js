import Anthropic from '@anthropic-ai/sdk';
import { Client, GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import express from 'express'
import cors from 'cors'

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPISM_API_KEY,
});

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.User
    ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setStatus('idle')
  client.user.setActivity('commands', { type: ActivityType.Listening })
  client.user.setUsername(`MōgiBot`)

  app.listen(process.env.PORT || 3000);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    if (message.content.startsWith('!')) return;
    if (message.guild) return;

    message.channel.sendTyping()

    const resp = await anthropic.messages.create({
        model:"claude-3-opus-20240229",
        max_tokens:1024,
        system:"Today is January 1, 2024.",
        messages:[
            {"role": "user", "content": message.content}
        ]
    })
    message.reply(resp.content[0].text)
    message.react('✅')
})

client.login(process.env.DISCORD_TOKEN);