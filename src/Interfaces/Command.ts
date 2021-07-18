import Client from '../Client/';
import { Message } from 'discord.js';

interface Run {
    // @ts-ignore
    (client: Client, message: Message, args: string[]);
}

export interface Command {
    name: string;
    description: string;
    aliases?:string[];
    run: Run;
}