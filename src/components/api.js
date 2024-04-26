import e from "express";
import {DiscordBot}  from "./discordBot.js"

const app = e();

let bot = new DiscordBot()

app.get('/', (req,res)=>{
    bot.run()
    res.send('Bot is running')
})

app.get('/queue', async (req,res)=>{
    let queue = await bot.getQueue()
    res.send(queue)
})

app.get('/currently-playing', (req,res)=>{
    res.send(bot.getCurrentlyPlaying())
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})

