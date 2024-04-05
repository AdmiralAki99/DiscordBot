import { Client,GatewayIntentBits,GuildMember,ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import {joinVoiceChannel,getVoiceConnection,createAudioPlayer,createAudioResource} from '@discordjs/voice'
import { configDotenv, parse } from 'dotenv'
import play from 'play-dl';
import 'yt-search'
import yts from 'yt-search'
import {Queue} from './queue.js'
import { Song } from './Song.js'

configDotenv()

const songQueue = new Queue()

const musicPlayer = createAudioPlayer()

let recentlyPlayed = null

let curerntlyPlaying = false

const client = new Client({intents:[
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
]})

const deployCommands = async (message)=>{
    await message.guild.commands.set([
        {
            name:'play',
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
            name:'ctrls',
            description:"Music Controls"
        },
        {
            name:'pause',
            description:"Pause the current song"
        },
        {
            name:'resume',
            description:"Resume the current song"
        },
        {
            name:'skip',
            description:"Skip the current song"
        }
    ])
}

const parseMessage = async (message)=>{
    console.log(message.content)
}

const pausePlayback = async (interaction)=>{
    musicPlayer.pause()
    interaction.reply(`Playback paused by ${interaction.user.username}`)
}

const resumePlayback = async (interaction)=>{
    musicPlayer.unpause()
    interaction.reply(`Playback resumed by ${interaction.user.username}`)
}

const skipSong = async (interaction)=>{
    musicPlayer.stop()
    interaction.reply(`Song skipped by ${interaction.user.username}`)
}


const musicSearch = async (query)=>{
    const metadata = await play.search(query, { limit: 1 })

    const song = new Song(metadata[0].title,metadata[0].channel.name,metadata[0].durationInSec,metadata[0].url,metadata[0].thumbnails[0].url)

    return song
}

const linkSearch = async (link)=>{
    const metadata = await play.video_info(link)

    const song = new Song(metadata.video_details.title,metadata.video_details.channel.name,metadata.video_details.durationInSec,metadata.video_details.url,metadata.video_details.thumbnails[0].url)

    return song
}

const cycleQueue = async (interaction)=>{
    while(!songQueue.isEmpty()){

        const song = songQueue.peek()

        let stream = await play.stream(song.url)
    
        const voiceConnection = joinVoiceChannel({
            channelId:interaction.member.voice.channel.id,
            guildId:interaction.guildId,
            adapterCreator:interaction.guild.voiceAdapterCreator
        })
    
        let resource = createAudioResource(stream.stream, {
            inputType: stream.type
        })
    
        const playPromise = new Promise((resolve, reject) => {
            musicPlayer.play(resource);
            musicPlayer.on('idle', () => {
                resolve();
            });
            musicPlayer.on('error', (error) => {
                reject(error);
            });
        });
    
        // await musicPlayer.play(resource)
    
        voiceConnection.subscribe(musicPlayer)
        await playPromise;
        songQueue.dequeue()
        recentlyPlayed = song
    }
}

const playSongFromQueue = async (interaction)=>{
    if(songQueue.isEmpty()) return

    curerntlyPlaying = true
    
    await cycleQueue(interaction).then(()=>{
        curerntlyPlaying = false
    })
   
}

const addToQueue = async (song) => {

    songQueue.enqueue(song);

    return song;
};

const displayQueue = async (message) =>{
    if(songQueue.isEmpty()) return message.reply('Queue is empty')

    const queue = songQueue.getQueue()

    let queueMessage = 'Queue:\n'

    queue.forEach((song,index)=>{
        queueMessage += `${index+1}. ${song.getMetadata()}\n`
    })

    message.reply(queueMessage)
}

const displayMusicControlButtons = async (interaction) =>{
    const confirm = new ButtonBuilder()
			.setCustomId('play')
			.setLabel('Play')
			.setStyle(ButtonStyle.Primary);

		const pause = new ButtonBuilder()
			.setCustomId('pause')
			.setLabel('Pause')
			.setStyle(ButtonStyle.Secondary);

        const skip = new ButtonBuilder()
            .setCustomId('skip')
            .setLabel('Skip')
            .setStyle(ButtonStyle.Secondary);

		const row = new ActionRowBuilder()
			.addComponents(confirm, pause, skip);

    let response = await interaction.reply({
        content: 'Music Controls',
        components:[row]})

    const filter = (i) => i.customId === 'play' || i.customId === 'pause' || i.customId === 'skip';

    const collector = response.createMessageComponentCollector({ filter, time: 15000 });

    collector.on('collect', async i => {
        if(i.customId === 'play'){
            await resumePlayback(interaction)
        }
        if(i.customId === 'pause'){
            await pausePlayback(interaction)
        }
        if(i.customId === 'skip'){
            await skipSong(interaction)
        }
    });
}

client.once('ready',()=>{
    console.log('Bot is ready')
})

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
  
    if (message.content === '!deploy') {
      deployCommands(message)
    }

    if (message.content === '!queue') {
        displayQueue(message)
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

    if(commandName === 'play'){
        const query = options.getString('query')

        if(query.includes('https://')){
            let song = await linkSearch(query)
            if(songQueue.size() === 0){
                interaction.reply(`Playing ${song.title}`)
                await addToQueue(song)
                await playSongFromQueue(interaction)
            }else{
                await addToQueue(song)
                interaction.reply(`Added ${song.title} to queue`)
            }
        }else{
            let song = await musicSearch(query)

            if(songQueue.size() === 0){
                interaction.reply(`Playing ${song.title} by ${song.artist}`)
                await addToQueue(song)
                await playSongFromQueue(interaction)
            }else{
                await addToQueue(song)
                interaction.reply(`Added ${song.title} by ${song.artist} to queue`)
            }
        }
       

       
    }
    if(commandName === 'yl'){
        
    }

    if(commandName === 'ctrls'){
        displayMusicControlButtons(interaction)
    }

    if(commandName === 'pause'){
        pausePlayback(interaction)
    }

    if(commandName === 'resume'){
        resumePlayback(interaction)
    }

    if(commandName === 'skip'){
        skipSong(interaction)
    }




})

client.login(process.env.DISCORD_TOKEN)