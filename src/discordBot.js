import { Client,GatewayIntentBits,GuildMember } from 'discord.js'
import { configDotenv, parse } from 'dotenv'
import youtube from 'ytdl-core'
import 'yt-search'
import yts from 'yt-search'
import Queue from './components/Queue'

const songQueue = new Queue()


const { getInfo} = youtube

configDotenv()

const client = new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const deployCommands = async (message)=>{
    await message.guild.commands.set([
        {
            name:'ys',
            description:"Search for a song on youtube",
            options:[
                {
                    name:'query',
                    description:'The song you want to search for',
                    type:3,
                    required:true
                }
            ]
        },
        {
            name:'yl',
            description:"Play a song from youtube link",
            options:[
                {
                    name:'query',
                    description:'The song link you want to play',
                    type:3,
                    required:true
                }
            ]
        }
    ])
}

const parseMessage = async (message)=>{
    console.log(message.content)
}

const musicSearch = async (query)=>{
    // getInfo(query).then((info)=>{
    //     console.log(info)
    // })
    const res = await yts('Odd Look')
    const metadata = await getInfo(res.videos[0].url)
    const song = {
        title:metadata.videoDetails.title,
        url:metadata.videoDetails.video_url,
        length:metadata.videoDetails.lengthSeconds
    }

    songQueue.enqueue(song)
    console.log(songQueue)
    
}

const playLink = async (link)=>{

}

client.once('ready',()=>{
    console.log('Bot is ready')
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    if (message.content === '!deploy') {
      deployCommands(message)
    }
});

client.on('interactionCreate', async (interaction)=>{
    if(!interaction.isCommand()) return

    if(!interaction.guildId) return

    if (!(interaction.member instanceof GuildMember)) return

    if (!interaction.member.voice.channel) {
        return interaction.reply('You need to be in a voice channel')
    }

    const {commandName,options} = interaction

    if(commandName === 'ys'){
        const query = options.getString('query')
        await musicSearch(query)
    }
    if(commandName === 'yl'){
        const query = options.getString('query')
       await playLink(query)
    }
})

client.login(process.env.DISCORD_TOKEN)