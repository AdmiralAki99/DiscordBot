import { Client,GatewayIntentBits,GuildMember,ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } from 'discord.js'
import {joinVoiceChannel,getVoiceConnection,createAudioPlayer,createAudioResource} from '@discordjs/voice'
import { configDotenv, parse } from 'dotenv'
import play from 'play-dl';
import 'yt-search'
import yts from 'yt-search'
import {Queue} from './queue.js'
import { Song } from './Song.js'
import {rollDice} from './diceparser.js'

configDotenv()

class DiscordBot{
    constructor(){
        this.songQueue = new Queue()
        this.musicPlayer = createAudioPlayer()
        this.recentlyPlayed = null
        this.currentlyPlaying = false
        this.client = new Client({intents:[
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildVoiceStates,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ]})
        this.bot_admins = ["119005036150784005", "558358512858824704"]
        this.non_voice_commands = ["kill-server", "roll"]
        this.repeat_song = 0 // Property for telling it to repeat song
        this.repeat_playlist = 0 // Property for telling to to repeat_playlist
        this.guildId = null
        this.activeVoiceChannel = null
    }

    getStatus = async ()=>{
        if(this.currentlyPlaying){
            return {
                "currently_playing": this.songQueue.peek().getTitle(),
                "requester": this.songQueue.peek().getRequestedBy(),
                "queue": JSON.stringify(this.songQueue.getQueue()),
                "repeat_song": JSON.stringify((this.repeat_song == 1)? true:false),
                "repeat_playlist": JSON.stringify((this.repeat_playlist == 1)? true:false),
            }
        }else{
            return {
                "currently_playing": "Nothing",
                "requester": "Nobody",
                "queue": [],
                "repeat_song": JSON.stringify((this.repeat_song == 1)? true:false),
                "repeat_playlist": JSON.stringify((this.repeat_playlist == 1)? true:false),
            }
        }

    }

    getActiveUsersOnVoiceChannel = async () =>{

        let activeUsers = []

        this.client.guilds.cache.get(this.guildId).channels.cache.forEach((channel)=>{
            if(channel.type == 2){
                channel.members.forEach((member)=>{
                    if(member.id != this.client.user.id){
                        activeUsers.push({username:member.user.username,id:member.user.id,channel:channel.name,avatar:member.user.avatarURL({dynamic:true}),accentColour:member.displayColor})
                    }
                })
            }
        })

        return activeUsers
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
                name:'repeat_song',
                description: 'Replay song at the top of the queue forever'
            },
            {
                name:'repeat_playlist',
                description: 'Cycle through current queue forever'
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
            },
            {
                name:'roll',
                description:"Roll a dice ex: 1D6",
                options:[
                    {
                        name:'query',
                        description:'The dice type you want to roll',
                        type:3,
                        required:true
                    }
                ]
            },
            {
                name:'kill-server',
                description:"Owner only command to kill server",
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
        this.songQueue.dequeue()
        interaction.reply(`Song skipped by ${interaction.user.username}`)
    }

    removeSongFromQueue = async () => {
        if (this.repeat_song){
            return
        }
        else if (this.repeat_playlist)
        {
            this.songQueue.enqueue(this.songQueue.dequeue())
        }
        else
        {
            this.songQueue.dequeue()
        }
        return
    }

    stopPlayer = async (interaction)=>{
        this.musicPlayer.stop()
        interaction.reply(`Playback stopped by ${interaction.user.username}`)
        this.songQueue.clearQueue()
    }

    adminMusicSearch = async (query)=>{
        const metadata = await play.search(query, { limit: 1 })

        const song = new Song(metadata[0].title,metadata[0].channel.name,metadata[0].durationInSec,metadata[0].url,metadata[0].thumbnails[0].url,"Admin")
    
        return song
    }

    adminQueueSong = async (query)=>{
        let song = await this.adminMusicSearch(query)

        if( this.songQueue.size() === 0){
            // await  this.addToQueue(song)

        }else{
            await  this.addToQueue(song)
            return true
        }
    }
    

    
    musicSearch = async (query,interaction)=>{
        const metadata = await play.search(query, { limit: 1 })

        const song = new Song(metadata[0].title,metadata[0].channel.name,metadata[0].durationInSec,metadata[0].url,metadata[0].thumbnails[0].url,interaction.user.username)
    
        return song
    }

    adminLinkSearch = async (link)=>{
        const metadata = await play.video_info(link)
    
        const song = new Song(metadata.video_details.title,metadata.video_details.channel.name,metadata.video_details.durationInSec,metadata.video_details.url,metadata.video_details.thumbnails[0].url,"Admin")
    
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

            this.activeVoiceChannel = interaction.member.voice.channel.id
        
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
            voiceConnection.subscribe( this.musicPlayer)
            await playPromise;
            this.removeSongFromQueue()
            this.recentlyPlayed = song
        }
    }
    
    playSongFromQueue = async (interaction)=>{
        if(this.songQueue.isEmpty()) return
    
        this.currentlyPlaying = true
        
        await  this.cycleQueue(interaction).then(()=>{
            this.currentlyPlaying = false
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
        return JSON.stringify(this.currentlyPlaying)
    }

    getQueue = async ()=>{
        let queue = this.songQueue.getQueue()

        let resp = JSON.stringify(queue)

        return resp
    }

    roll_random = async (query, interaction)=>{
        let val = rollDice(query)

        interaction.reply(`Dice Roll of: ${query}\nDice Value is: ${val.sum}`)

        return JSON.stringify(val)
    }

    play = async (query, interaction)=>{
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
            const {commandName,options} = interaction

            if(!interaction.isCommand()) return
        
            if(!interaction.guildId) return
        
            if (!(interaction.member instanceof GuildMember)) return
        
            if (!interaction.member.voice.channel && !this.non_voice_commands.includes(commandName)) {
                return interaction.reply('You need to be in a voice channel')
            }

            this.guildId = interaction.guildId
        
            switch(commandName)
            {
                case 'play':
                    const query = options.getString('query')
                    await this.play(query, interaction);
                    break
                case 'repeat_song':
                    // Stateful command - this is not exactly a good way to do this I think
                    this.repeat_song = (this.repeat_song + 1) & 1 // My favorite toggle trick
                    interaction.reply(`Repeat set to ${this.repeat_song}`)
                    break
                case 'repeat_playlist':
                    this.repeat_playlist = (this.repeat_playlist + 1) & 1
                    interaction.reply(`Repeat Playlist set to ${this.repeat_playlist}`)
                    break;
                case 'yl':
                    console.log("This does nothing")
                    break;
                case 'ctrls':
                    this.displayMusicControlButtons(interaction)
                    break
                case 'pause':
                    this.pausePlayback(interaction)
                    break
                case 'resume':
                    this.resumePlayback(interaction)
                    break
                case 'skip':
                    this.skipSong(interaction)
                    break
                case 'stop':
                    this.stopPlayer(interaction)
                    break
                case 'kill-server':
                    if(this.bot_admins.includes(interaction.user.id))
                    {
                        await interaction.reply(`Killing server! Goodbye ${interaction.user.username} :)`)
                        process.exit(0);
                        break; // Should never make it here
                    }
                    interaction.reply('No')
                    let user = this.client.users.cache.get(interaction.user.id)
                    user.send("Naughty Naughty, Only Owners can run this command!")
                    break
                case 'roll':
                    var roll_query = options.getString('query')
                    try{
                        await this.roll_random(roll_query, interaction)
                    } catch (e) {
                        logError(e,interaction.channel)
                    }
                    break
                default:
                    break
            }
            }
        )
        this.client.login(process.env.DISCORD_TOKEN)
        
    }
    
}

// let bot = new DiscordBot()

// bot.run()

export {DiscordBot}