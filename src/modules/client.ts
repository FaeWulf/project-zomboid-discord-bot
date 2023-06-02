import { SapphireClient, LogLevel, container } from '@sapphire/framework'
import RCON from 'ts-rcon'
import config from '../config.json'

//pattern commands
import '@sapphire/plugin-pattern-commands/register';

import * as dotenv from 'dotenv'
import { ActivityType, Partials } from 'discord.js';
dotenv.config()

declare module '@sapphire/pieces' {
    interface Container {
        rcon: RCON;
    }
}

let playerCount: number = 0

export class FwulfClient extends SapphireClient {
    constructor() {
        super({
            defaultPrefix: '>',
            //regexPrefix: /^(hey +)?bot[,! ]/i,
            caseInsensitiveCommands: true,
            logger: {
                level: LogLevel.Info
            },
            shards: 'auto',
            intents: [
                "Guilds",
                "GuildMembers",
                "GuildEmojisAndStickers",
                "GuildVoiceStates",
                "GuildMessages",
                "GuildMessageReactions",
                "DirectMessages",
                "DirectMessageReactions"
            ],
            partials: [Partials.Message, Partials.Reaction, Partials.GuildMember],
            loadMessageCommandListeners: true
        })

        const rconClient = new RCON(process.env.RCONip || "localhost", process.env.RCONport as unknown as number || 27015, process.env.RCONpassword || "")

        rconClient.on('auth', function () {

            console.log("Authenticated");
            console.log("Sending command: help")
            rconClient.send("players");

        }).on('response', function (str) {
            let res: string = str as string
            if (res.includes("Players connected")) {
                const num: number = res.split('(')[1].match(/\d+/g) as unknown as number
                if (num != playerCount) {
                    playerCount = num

                    container.client.user?.setActivity(`${playerCount} survivor(s).`, { type: ActivityType.Watching });
                }
            }

            //console.log("Response: " + str);
        }).on('error', function (err) {
            console.log("Error: " + err);
        }).on('end', function () {
            console.log("Connection closed");
        });

        rconClient.connect();

        container.rcon = rconClient
    }

    async init(token: any) {
        try {
            this.logger.info('Logging in');
            await this.login(token);
            this.logger.info('logged in');
        } catch (error) {
            this.logger.fatal(error);
            this.destroy();
            process.exit(1);
        }
    }
}