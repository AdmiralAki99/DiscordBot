import e from "express";
import {DiscordBot}  from "./discordBot.js"
import bodyParser from "body-parser";

const app = e();

app.use(bodyParser.json())

let bot = new DiscordBot()

app.get('/', (req,res)=>{
    bot.run()
    res.send('Bot is running')
})

app.get('/queue', async (req,res)=>{
    let queue = await bot.getQueue()
    res.send(queue)
})

app.get('/currently-playing', async (req,res)=>{
    res.send(await bot.getCurrentlyPlaying())
})

app.post('/play', async (req,res)=>{
    let title = req.body.title
    bot.play(title)
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
})

