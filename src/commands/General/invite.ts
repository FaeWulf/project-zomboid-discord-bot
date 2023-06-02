import { Command } from '@sapphire/framework';
import { ColorResolvable, Message, EmbedBuilder, MessageInteraction } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators'
import config from '../../config.json'

@ApplyOptions<Command.Options>({
    name: "invite",
    description: "Get ninym's invite link"
})
export class FwulfCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) => {
            builder
                .setName(this.name)
                .setDescription(this.description)
        })
    }

    public async messageRun(message: Message) {
        message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor as ColorResolvable)
                    .setDescription(`[Here is the link](https://discord.com/api/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=1071631366721&scope=bot)`)
            ]
        })
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor as ColorResolvable)
                    .setDescription(`[Here is the link](https://discord.com/api/oauth2/authorize?client_id=${this.container.client.user?.id}&permissions=1071631366721&scope=bot)`)
            ]
        })
    }
}



