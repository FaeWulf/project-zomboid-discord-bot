import * as utils from '../modules/utils'
import { Listener, UserError, ChatInputCommandDeniedPayload } from "@sapphire/framework";

export class CommandDenied extends Listener {
  public constructor(context: Listener.Context, options: Listener.Options) {
    super(context, {
      ...options,
      event: "chatInputCommandDenied"
    });
  }

  public async run(error: UserError, { interaction }: ChatInputCommandDeniedPayload) {
    if (Reflect.get(Object(error.context), "silent")) return;

    if (error.identifier === "preconditionCooldown") {
      const { remaining } = error.context as { remaining: number };
      return await interaction.reply({ content: `You are on a cooldown.. (duration: ${utils.humanizeTime(remaining)})`, ephemeral: true })
    } else {
      return
    }
  }
}