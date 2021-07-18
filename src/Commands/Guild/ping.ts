import { Command } from '../../Interfaces/Command';

export const command: Command = {
    name: 'ping',
    description: "Ping data of the bot",
    run: async(client, message, args) => {
        message.channel.send(`${client.ws.ping} ping!`);
    }
}