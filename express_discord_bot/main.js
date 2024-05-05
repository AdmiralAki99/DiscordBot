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

app.get('/currently-playing', async (req,res)=>{
    res.send(await bot.getCurrentlyPlaying())
})

app.post('/play', async (req,res)=>{
    let title = req.body.title
    fake_interaction = null
    bot.play(title, fake_interaction)
})

app.get('/status',async (req,res)=>{
    res.send(await bot.getStatus())
})

app.listen(3000, ()=>{
    console.log('Listening on port 3000');
    bot.run()
})

export {app}

