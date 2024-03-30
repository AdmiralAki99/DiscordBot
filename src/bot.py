import asyncio
import os
from pprint import pprint

from async_timeout import timeout

import discord
from discord import Intents
import requests
from dotenv import load_dotenv
import yt_dlp
from discord.utils import get
from discord.ext import commands,voice_recv
from Application import CounterApp
from discord import Button
from pytube import YouTube
from pytube import Search

load_dotenv()


class Discord_Client(discord.Client):
    BOT_TOKEN = os.getenv('DISCORD_TOKEN')
    voice_channel = None
    current_message = None
    music_queue = []
    current_song_url = None
    current_song_title = None
    user_list = []
    user_list_name = []

    async def on_ready(self):
        print(f'{self.user} has connected to Discord!')
        await self.active_users()

    async def member_join_event(self, member):
        # await member.create_dm()
        # await member.dm_channel.send(
        #     "Welcome to the server {user}".format(user=member.name)
        # )
        if member not in self.user_list:
            self.user_list.append(member)
            self.user_list_name.append(member.name)

    async def active_users(self):
        guild = self.guilds[0]
        for member in guild.members:
            self.user_list.append(member)
            self.user_list_name.append(member.name)

    async def on_message(self, message):
        if self.user == message.author:
            return  # Identifies the Bots
        self.current_message = message
        if '!y ' in (message.content.lower())[0:4]:
            if self.current_message.author.voice is None:
                print('User {} is not in a voice channel'.format(self.current_message.author))
                return
            await self.play_youtube_link((message.content.split(' '))[1])
        if '!ys ' in (message.content.lower())[0:4]:
            await self.youtube_search((message.content.lower())[4:])
        if '!mc' in self.current_message.content:
            await self.music_controls()
        if '$Q' in self.current_message.content:
            await self.__print_queue__()
        if '$P' in self.current_message.content:
            await self.pause()
        if '$R' in self.current_message.content:
            await self.resume()
        if '$S' in self.current_message.content:
            await self.skip()
        self.current_message = None

    ## Music Player Commands
    async def play_youtube_link(self, link):

        async with self.current_message.author.typing():
            if self.voice_channel is None:
                await self.join_channel()
            self.voice_channel = get(self.voice_clients, guild=self.current_message.guild)
            if len(self.music_queue) == 0:
                await self.__add_song__(link)
                await self.play_music()
            else:
                await self.__add_song__(link)

    async def play_music(self):
        FFMPEG_OPTS = {'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5', 'options': '-vn'}
        print('Playing Song ')
        while len(self.music_queue) != 0:
            self.current_song_url = self.music_queue[0]
            yt = YouTube(self.current_song_url)
            self.voice_channel.play(discord.FFmpegPCMAudio(self.current_song_url, **FFMPEG_OPTS,executable=f"D:\dev\FFmpeg\FFmpeg\\bin\\ffmpeg"))
            self.music_queue.pop(0)

    async def __add_song__(self, link):
        video, audio = await self.find_song(link)
        self.music_queue.append(audio)

    async def pause(self):
        voice = self.current_message.guild.voice_client
        if voice.is_playing():
            voice.pause()
        else:
            print("Bot is Inactive")

    async def resume(self):
        voice = self.current_message.guild.voice_client
        if voice.is_playing():
            pass
        else:
            voice.resume()

    async def skip(self):
        voice = self.current_message.guild.voice_client
        if voice.is_playing():
            voice.stop()
            await self.play_music()
        else:
            pass

    async def __print_queue__(self):
        print(Discord_Client.music_queue)
        print(self.current_song_url)

    async def music_controls(self):
        await self.current_message.channel.send("Hello World",components=[[Button(label="⏮",custom_id="Rewind"),Button(label="▶️",custom_id="Play"),Button(label="⏸",custom_id="Pause"),Button(label="⏭",custom_id="Skip"),Button(label="⏹",custom_id="Stop")]])
        while True:
            interaction = await self.wait_for('button_click')
            await self.on_button_press(interaction=interaction)

    async def find_song(self, link):
        res = Search(link)
        yt_links = res.results
        ids = [url.video_id for url in yt_links]
        base_url = f"https://www.youtube.com/watch?v={ids[0]}"
        return base_url

    async def youtube_search(self, link):
        async with self.current_message.author.typing():
            if self.voice_channel == None:
                await self.join_channel()
            self.voice_channel = get(self.voice_clients, guild=self.current_message.guild)
            if len(self.music_queue) == 0:
                audio = await self.search_song(link)
                self.music_queue.append(audio)
                await self.play_music()
            else:
                audio = await self.search_song(link)
                self.music_queue.append(audio)

    async def search_song(self, link):
        res = Search(link)
        yt_links = res.results
        ids = [url.video_id for url in yt_links]
        base_url = f"https://www.youtube.com/watch?v={ids[0]}"
        return base_url

    def begin(self):
        return self.run(self.BOT_TOKEN)

    def stop(self):
        self.leave_channel()

    async def join_channel(self):
        self.voice_channel = self.current_message.author.voice.channel
        await self.voice_channel.connect()

    async def leave_channel(self):
        if self.voice_channel.is_connected():
            await self.voice_channel.disconnect()
        else:
            pass

    # async def on_button_press(interaction):
    #     if (interaction.raw_data['data'])['custom_id'] == 'Rewind':
    #         await interaction.channel.send("Response")
    #         await interaction.respond(content="Playing Song ")
    #         return
    #     elif (interaction.raw_data['data'])['custom_id'] == 'Pause':
    #         await interaction.respond(content="Pause")
    #         await Discord_Client.pause(CLIENT)
    #         return
    #     elif (interaction.raw_data['data'])['custom_id'] == 'Play':
    #         await interaction.respond(content="Play")
    #         await Discord_Client.resume(CLIENT)
    #     elif (interaction.raw_data['data'])['custom_id'] == 'Skip':
    #         await interaction.respond(content="Skip")
    #         await Discord_Client.skip(CLIENT)
    #     elif (interaction.raw_data['data'])['custom_id'] == 'Stop':
    #         await interaction.respond(content="Stop")
    #         await Discord_Client.stop(CLIENT)

    ## Scribble/IO Maker


# intents = discord.Intents.all()

# CLIENT = Discord_Client(intents=intents)

# CLIENT.begin()

# SCRIBBLE_URL = 'https://skribbl.io'
#
# page = requests.get(SCRIBBLE_URL)
#
# opts = Options()
#
# browser = Safari(options=opts)
# browser.get(SCRIBBLE_URL)
# browser.find_element_by_id('buttonLoginCreatePrivate').click()
# # val = browser.find_element_by_class_name('invite-container')
# # # print(val.get_attribute('class'))
# # val = val.find_elements_by_class_name('invite-bar')[0]
# # input_2 = val.find_elements_by_class_name('invite-input')[0]
# # input_2 = input_2.find_elements_by_class_name('invite-overlay')[0]
# # input = val.find_elements_by_id('inviteCopyButton')[0]
# browser.execute_script()
#
# print(input.text)

if __name__ == "__main__":

    intents = Intents.default()
    intents.voice_states

    CLIENT = Discord_Client(intents=intents)

    CLIENT.begin()