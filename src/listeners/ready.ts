import { Listener, UserError, ChatInputCommandDeniedPayload } from "@sapphire/framework";
import { ActivityType, APIEmbed, ColorResolvable, EmbedBuilder, TextChannel, UserFlagsBitField } from "discord.js"

import readlines from 'readline-reverse'

import { glob } from "glob";

import { zomboidPath, channelID, embedColor } from "../config.json"

export class CommandDenied extends Listener {
    public constructor(context: Listener.Context, options: Listener.Options) {
        super(context, {
            ...options,
            event: "ready"
        });
    }

    public async run(e: any) {
        setTimeout(() => console.log("Client ready!"), 1000)
        this.container.client.user?.setActivity(`0 survivor(s).`, { type: ActivityType.Watching });
        setInterval(() => {
            this.container.rcon.send("players")
        }, 5000);

        let targetChannel: TextChannel = this.container.client.channels.cache.get(channelID) as TextChannel

        //chatLogs
        let currentTimeStamp: string = ''
        let NextcurrentTimeStamp: string = ''
        setInterval(async () => {
            const chatLogs = await glob(zomboidPath + "/Logs/*chat.txt")
            if (chatLogs.length > 0) {
                // init
                const reader = new readlines()

                // open file
                await reader.open(chatLogs[0])

                let lineContent = await reader.read(1)

                let chatContents: string[] = []
                let firstCapture = true

                do {
                    //if not info about player message
                    if (!lineContent[0].includes("Got message")) {
                        lineContent = await reader.read(1)
                        continue
                    }

                    let timeStampRegExp = /\[([^\]]+)\]/
                    let channelRegExp = /chat=([^,]+),/
                    let userRegExp = /author='([^,]+)'/
                    let contentRegExp = /text='([^,]+)'/

                    let timeStamp = timeStampRegExp.exec(lineContent[0])![1]
                    let channel = channelRegExp.exec(lineContent[0])![1]
                    let user = userRegExp.exec(lineContent[0])![1]
                    let content = contentRegExp.exec(lineContent[0])![1]

                    //if reach to the last current timeStamp
                    if (timeStamp == currentTimeStamp) {
                        break
                    }

                    if (firstCapture) {
                        NextcurrentTimeStamp = timeStamp
                        firstCapture = false
                    }

                    chatContents.push(`[${channel}] ${user}: ${content}`)

                    lineContent = await reader.read(1)
                }
                while (lineContent.length != 0)

                for (var i = chatContents.length - 1; i >= 0; i--) {
                    targetChannel.send({ content: chatContents[i] })
                }

                currentTimeStamp = NextcurrentTimeStamp
            }

        }, 2000);


        //user logs
        let userLogCurrentTimeStamp: string = ''
        let userLogNextcurrentTimeStamp: string = ''
        setInterval(async () => {
            const chatLogs = await glob(zomboidPath + "/Logs/*user.txt")
            if (chatLogs.length > 0) {
                // init
                const reader = new readlines()

                // open file
                await reader.open(chatLogs[0])

                let lineContent = await reader.read(1)

                let contents: EmbedBuilder[] = []
                let firstCapture = true

                do {
                    //if not info about player message

                    if (!lineContent[0].includes("fully connected") && !lineContent[0].includes("disconnected") && !lineContent[0].includes("died at")) {
                        lineContent = await reader.read(1)
                        continue
                    }

                    let timeStampRegExp = /\[([^\]]+)\]/
                    let timeStamp = timeStampRegExp.exec(lineContent[0])![1]

                    //if reach to the last current timeStamp
                    if (timeStamp == userLogCurrentTimeStamp) {
                        break
                    }

                    if (firstCapture) {
                        userLogNextcurrentTimeStamp = timeStamp
                        firstCapture = false
                    }

                    if (lineContent[0].includes("fully connected")) {
                        let userRegExp = /"([^"]+)"/
                        let user = userRegExp.exec(lineContent[0])![1]
                        contents.push(
                            new EmbedBuilder()
                                .setColor("Green")
                                .setDescription(`📥 \`${user}\` joined the server`)
                        )
                    }

                    if (lineContent[0].includes("disconnected")) {
                        let userRegExp = /"([^"]+)"/
                        let user = userRegExp.exec(lineContent[0])![1]
                        contents.push(
                            new EmbedBuilder()
                                .setColor("Grey")
                                .setDescription(`📤 \`${user}\` disconnected`)
                        )
                    }

                    if (lineContent[0].includes("died at")) {
                        let userRegExp = /user ([^,]+) died at/
                        let user = userRegExp.exec(lineContent[0])![1]
                        contents.push(
                            new EmbedBuilder()
                                .setColor("Red")
                                .setDescription(`☠️ \`${user}\` died to skill issues, better next time.`)
                        )
                    }

                    lineContent = await reader.read(1)
                }
                while (lineContent.length != 0)

                for (var i = contents.length - 1; i >= 0; i--) {
                    targetChannel.send({
                        embeds: [
                            contents[i]
                        ]
                    })
                }

                userLogCurrentTimeStamp = userLogNextcurrentTimeStamp
            }

        }, 2000);
    }
}