import { Command } from '@sapphire/framework';
import { Message } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators'
import config from '../../config.json'

@ApplyOptions<Command.Options>({
    name: 'clean',
    description: 'no',
})
export class UserCommand extends Command {

    public async messageRun(message: Message) {

        if (message.author.id != config.ownerID) {
            message.reply({ content: `**You are not my father!**` })
            return
        }

        this.container.client.application?.commands.set([]).then(console.log).catch(console.error)

        message.reply('Clean done')
    }

}