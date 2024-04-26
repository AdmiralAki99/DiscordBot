import { Client,GatewayIntentBits,GuildMember,ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import {joinVoiceChannel,getVoiceConnection,createAudioPlayer,createAudioResource} from '@discordjs/voice'
import { configDotenv, parse } from 'dotenv'
import play from 'play-dl';
import 'yt-search'
import yts from 'yt-search'
import {Queue} from './queue.js'
import { Song } from './Song.js'

configDotenv()

class DiscordBot{
    constructor(){
        this.songQueue = new Queue()
        this.musicPlayer = createAudioPlayer()
        this.recentlyPlayed = null
        this.curerntlyPlaying = false
        this.client = new Client({intents:[
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]})
    }

    deployCommands = async (message)=>{
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
            },
            {
                name:'stop',
                description:"Stop the music player"
            }
        ])
    }

    parseMessage = async (message)=>{
        console.log(message.content)
    }

    pausePlayback = async (interaction)=>{
        this.musicPlayer.pause()
        interaction.reply(`Playback paused by ${interaction.user.username}`)
    }

    resumePlayback = async (interaction)=>{
        this.musicPlayer.unpause()
        interaction.reply(`Playback resumed by ${interaction.user.username}`)
    }

    skipSong = async (interaction)=>{
        this.musicPlayer.stop()
        interaction.reply(`Song skipped by ${interaction.user.username}`)
    }

    stopPlayer = async (interaction)=>{
        this.musicPlayer.stop()
        interaction.reply(`Playback stopped by ${interaction.user.username}`)
        this.songQueue.clearQueue()
    }
    
    musicSearch = async (query,interaction)=>{
        const metadata = await play.search(query, { limit: 1 })
    
        const song = new Song(metadata[0].title,metadata[0].channel.name,metadata[0].durationInSec,metadata[0].url,metadata[0].thumbnails[0].url,interaction.user.username)
    
        return song
    }

    linkSearch = async (link,interaction)=>{
        const metadata = await play.video_info(link)
    
        const song = new Song(metadata.video_details.title,metadata.video_details.channel.name,metadata.video_details.durationInSec,metadata.video_details.url,metadata.video_details.thumbnails[0].url,interaction.user.username)
    
        return song
    }

    playlistSearch = async (playlistLink,interaction)=>{
        const listID = playlistLink.split('list=')[1]
        const playlist = await yts({listId: listID})
        const songList = []
    
        const searchPromise = playlist.videos.map(async (video)=>{
            return this.musicSearch(video.title,interaction)
        })

        const songs = await Promise.all(searchPromise)

        songList.push(...songs)

        return songList
    }

    cycleQueue = async (interaction)=>{
        while(!this.songQueue.isEmpty()){
    
            const song = this.songQueue.peek()
    
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
                this.musicPlayer.play(resource);
                this.musicPlayer.on('idle', () => {
                    resolve();
                });
                this.musicPlayer.on('error', (error) => {
                    reject(error);
                });
            });
        
            // await musicPlayer.play(resource)
        
            voiceConnection.subscribe( this.musicPlayer)
            await playPromise;
            this.songQueue.dequeue()
            this.recentlyPlayed = song
        }
    }
    
    playSongFromQueue = async (interaction)=>{
        if(this.songQueue.isEmpty()) return
    
        this.curerntlyPlaying = true
        
        await  this.cycleQueue(interaction).then(()=>{
            this.curerntlyPlaying = false
        })
       
    }

    addToQueue = async (song) => {

        this.songQueue.enqueue(song);
    
        return song;
    };

    displayQueue = async (message) =>{
        if( this.songQueue.isEmpty()) return message.reply('Queue is empty')
    
        const queue =  this.songQueue.getQueue()
    
        let queueMessage = 'Queue:\n'
    
        queue.forEach((song,index)=>{
            queueMessage += `${index+1}. ${song.getMetadata()}\n`
        })

        if(queueMessage.length > 2000){
            queueMessage = 'Queue:\n'
            queue.forEach((song,index)=>{
                if(index < 10) queueMessage += `${index+1}. ${song.getMetadata()}\n`
            })
        }
    
        message.reply(queueMessage)
    }

    displayMusicControlButtons = async (interaction) =>{
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
                await  this.resumePlayback(interaction)
            }
            if(i.customId === 'pause'){
                await  this.pausePlayback(interaction)
            }
            if(i.customId === 'skip'){
                await  this.skipSong(interaction)
            }
        });
    }

    getCurrentlyPlaying = async ()=>{
        return this.curerntlyPlaying
    }

    getQueue = async ()=>{
        let queue = this.songQueue.getQueue()

        let resp = JSON.stringify(queue)

        return resp
    }
    
    run = async ()=>{
        this.client.once('ready',()=>{
            console.log('Bot is ready')
        })

        this.client.on('messageCreate', async (message) => {
            if (message.author.bot) return;
          
            if (message.content === '!deploy') {
                this.deployCommands(message)
            }
        
            if (message.content === '!queue') {
                this.displayQueue(message)
            }
        
        });

        this.client.on('interactionCreate', async (interaction)=>{
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
                    if (query.includes('list=')){
                        let songs = await this.playlistSearch(query,interaction)
                        if( this.songQueue.size() === 0){
                            interaction.reply(`Playing playlist`)
                            songs.forEach(async (song)=>{
                                await  this.addToQueue(song)
                            })
                            await  this.playSongFromQueue(interaction)
                        }else{
                            songs.forEach(async (song)=>{
                                await  this.addToQueue(song)
                            })
                            interaction.reply(`Added playlist to queue`)
                        }
                    }else{
                        let song = await  this.linkSearch(query,interaction)
                        if( this.songQueue.size() === 0){
                            interaction.reply(`Playing ${song.title}`)
                            await  this.addToQueue(song)
                            await  this.playSongFromQueue(interaction)
                        }else{
                            await  this.addToQueue(song)
                            interaction.reply(`Added ${song.title} to queue`)
                        }
                    }
                    
                }else{
                    let song = await  this.musicSearch(query,interaction)
        
                    if( this.songQueue.size() === 0){
                        interaction.reply(`Playing ${song.title} by ${song.artist}`)
                        await  this.addToQueue(song)
                        await  this.playSongFromQueue(interaction)
                    }else{
                        await  this.addToQueue(song)
                        interaction.reply(`Added ${song.title} by ${song.artist} to queue`)
                    }
                }
               
        
               
            }
            if(commandName === 'yl'){
                
            }
        
            if(commandName === 'ctrls'){
                this.displayMusicControlButtons(interaction)
            }
        
            if(commandName === 'pause'){
                this.pausePlayback(interaction)
            }
        
            if(commandName === 'resume'){
                this.resumePlayback(interaction)
            }
        
            if(commandName === 'skip'){
                this.skipSong(interaction)
            }

            if(commandName === 'stop'){
                this.stopPlayer(interaction)
            }
        })

        this.client.login(process.env.DISCORD_TOKEN)
        
    }
    
}

// let bot = new DiscordBot()

// bot.run()

export {DiscordBot}