# project-zomboid-discord-bot

Simple discordjs bot for project zomboid dedicated server.

## Current features
- Send messages from PZ to Discord
- Presence shows number of players currently online
- Join, Leave, Die message.

## How to use
```
1. clone repo
2. npm install
3. npm start
```
*Must config .env file and src/config.json before running bot.
```
.env:
- token: discord bot token
- RCONip: server's ip
- RCONport: RCON port (default 27015)
- RCONpassword: your PZ's RCON password
```

```
src/config.json:
- zomboidPath: your Zomboid path foldder (Example: C:\Users\<username>\Zomboid or ~\Zomboid)
- ownerID: optional, discord user's id
- channelID: discord channel's ID, where bot will send messages
```
