import e from "express";
import {DiscordBot}  from "./src/components/discordBot.js"
import bodyParser from "body-parser";

const app = e();

app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, PUT");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    next();
})

let bot = new DiscordBot()

app.get('/', (req,res)=>{
    bot.run()
    res.send('Bot is running')
})

app.get('/queue', async (req,res)=>{
    let queue = await bot.getQueue()
    res.send(queue)
})

app.get('/pause', async (req,res)=>{
    let result = await bot.adminPausePlayback()

    if (result){
        res.send('Playback paused')
    }else{
        res.send('Playback not paused')
    }
})

app.get('/resume', async (req,res)=>{
    let result = await bot.adminResumePlayback()

    if (result){
        res.send('Playback resumed')
    }else{
        res.send('Playback not resumed')
    }
})

app.get('/stop', async (req,res)=>{
    let result = await bot.adminStopPlayback()

    if (result){
        res.send('Playback stopped')
    }else{
        res.send('Playback not stopped')
    }
})

app.get('/skip', async (req,res)=>{
    let result = await bot.adminSkipPlayback()

    if (result){
        res.send('Song skipped')
    }
    else{
        res.send('Song not skipped')
    }

})

app.post('/deafen', async (req,res)=>{
    let userId = req.body.userId
    let result = await bot.adminDeafenUser(userId)
    
    if (result){
        res.send('User deafened')
    }else{
        res.send('User not deafened')
    }
})

app.post('/undeafen', async (req,res)=>{
    let userId = req.body.userId
    let result = await bot.adminUndeafenUser(userId)

    if (result){
        res.send('User undeafened')
    }else{
        res.send('User not undeafened')
    }
})

app.post('/kick', async (req,res)=>{
    let userId = req.body.userId
    let result = await bot.adminKickUser(userId)

    if (result){
        res.send('User kicked')
    }else{
        res.send('User not kicked')
    }
})

app.post('/mute', async (req,res)=>{
    let userId = req.body.userId
    let result = await bot.adminMuteUser(userId)

    if (result){
        res.send('User muted')
    }else{
        res.send('User not muted')
    }
})

app.post('/unmute', async (req,res)=>{
    let userId = req.body.userId
    let result = await bot.adminUnmuteUser(userId)

    if (result){
        res.send('User unmuted')
    }else{
        res.send('User not unmuted')
    }
})

app.get('/logs/get/records',async (req,res)=>{
    res.send(await bot.getRequestLogs())
})

app.get('/currently-playing', async (req,res)=>{
    res.send(await bot.getCurrentlyPlaying())
})

app.post('/youtube/search', async (req,res)=>{
    let title = req.body.title
    let result = await bot.adminQueueSong(title)
    
    if (result){
        res.send('Song added to queue')
    }else{
        res.send('Song not found')
    }
})

app.get('/status',async (req,res)=>{
    res.send(await bot.getStatus())
})

app.post('/mute', async (req,res)=>{

})

app.get('/voiceStatus',async(req,res)=>{
    res.send(await bot.getUserStatuses())
})

app.get('/users',async(req,res)=>{
    res.send(await bot.getActiveUsersOnVoiceChannel())
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
    bot.run()
})

export {app}

