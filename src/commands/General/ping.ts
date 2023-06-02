import { Command } from '@sapphire/framework';
import { ColorResolvable, Message, EmbedBuilder } from 'discord.js';
import { ApplyOptions } from '@sapphire/decorators'
import config from '../../config.json'

@ApplyOptions<Command.Options>({
    name: 'ping',
    description: 'ping pong ping pong with NinymRalei'
})
export class UserCommand extends Command {

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName(this.name)
                .setDescription(this.description)
        );
    }

    public async messageRun(message: Message) {
        const msg = await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor as ColorResolvable)
                    .setDescription(`Pinging...`)
            ]
        })

        const choices = ['Is this really my ping?', 'Is that okay? I can\'t look!', 'I hope it isn\'t bad!'];
        const response = choices[Math.floor(Math.random() * choices.length)];
        const createdTime = msg.createdTimestamp

        let embed = new EmbedBuilder()
            .setColor(config.embedColor as ColorResolvable)
            .setDescription(`${response}`)
            .addFields(
                {
                    name: "Bot latency",
                    value: `${createdTime - message.createdTimestamp}ms`
                },
                {
                    name: "API latency",
                    value: `${Math.round(this.container.client.ws.ping)}ms`
                }
            )

        return await msg.edit({ embeds: [embed] })
    }

    public async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        const msg = await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor(config.embedColor as ColorResolvable)
                    .setDescription(`Pinging...`)
            ], fetchReply: true
        })
        const choices = ['Is this really my ping?', 'Is that okay? I can\'t look!', 'I hope it isn\'t bad!'];
        const response = choices[Math.floor(Math.random() * choices.length)];

        const createdTime = msg instanceof Message ? msg.createdTimestamp : 0;

        let embed = new EmbedBuilder()
            .setColor(config.embedColor as ColorResolvable)
            .setDescription(`${response}`)
            .addFields(
                {
                    name: "Bot latency",
                    value: `${createdTime - interaction.createdTimestamp}ms`
                },
                {
                    name: "API latency",
                    value: `${Math.round(this.container.client.ws.ping)}ms`
                }
            )

        return await interaction.editReply({ embeds: [embed] })
    }
}