import { Precondition } from '@sapphire/framework';
import { CommandInteraction, Message } from 'discord.js';
import config from '../config.json'
import { ApplyOptions } from '@sapphire/decorators'

@ApplyOptions<Precondition.Options>({
    name: 'ownerOnly'
})
export class OwnerOnlyPrecondition extends Precondition {

    public override async messageRun(message: Message) {

        if (message.author.id != config.ownerID) {
            message.reply({ content: `**You are not my father!**` })
            return this.error({ message: "you are not my master..." })
        }

        return this.ok()
    }

    public override async chatInputRun(interaction: CommandInteraction) {

        if (interaction.user.id != config.ownerID) {
            interaction.reply({ content: `**You are not my father!**` })
            return this.error({ message: "you are not my master..." })
        }

        return this.ok()
    }

}
