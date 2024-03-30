import threading
import discord
import tkinter as tk

class CounterApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Counter")
        self.counter = 0
        self.label = tk.Label(self, text="0")
        self.label.pack()
        self.button = tk.Button(self, text="Increment", command=self.count)
        self.button.pack()

    def count(self):
        self.counter += 1
        self.label.config(text=str(self.counter))

def gui():
    app = CounterApp()
    app.mainloop()

def discord_bot():
    client = discord.Client()

    @client.event
    async def on_ready():
        print("Bot is ready.")

    client.run("YOUR_BOT_TOKEN")

if __name__ == '__main__':
    gui_thread = threading.Thread(target=gui)
    discord_thread = threading.Thread(target=discord_bot)

    gui_thread.start()
    discord_thread.start()