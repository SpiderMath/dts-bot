import { Client, Collection } from "discord.js";
import { connect } from 'mongoose';
import path from 'path';
import { readdirSync } from 'fs';
import { Command } from '../Interfaces/Command';
import { Event } from '../Interfaces/Event';
import { Config } from '../Interfaces/Config';
//@ts-ignore
import ConfigJson from '../Secrets/config.json';

class ExtendedClient extends Client {
    public commands: Collection<string, Command> = new Collection();
    public events: Collection<string, Event> = new Collection();
    public config: Config = ConfigJson;
    public aliases: Collection<string, Command> = new Collection();

    constructor() {
        super();
    }

    public async init() {
        this.login(this.config.token);
        connect(this.config.mongoURI, {
            useUnifiedTopology: true,
            useFindAndModify: true,
            useNewUrlParser: true
        });

        /* Commands */
        const commandPath = path.join(__dirname, ".." , "Commands");
        readdirSync(commandPath).forEach((dir) => {
            const commands = readdirSync(`${commandPath}/${dir}`).filter((file) => file.endsWith(".ts"));

            for(let file of commands) {
                const { command } = require(`${commandPath}/${dir}/${file}`);
                if(!command.aliases) command.aliases = [];
                this.commands.set(command.name, command);

                if(command?.aliases.length !== 0) {
                    command.aliases.forEach((alias: any) => {
                        this.aliases.set(alias, command);
                    })
                }
            }
        })

        /* Events */
        const eventPath = path.join(__dirname, "..", "Events");
        readdirSync(eventPath).forEach(async (file) => {
            const { event } = await import(`${eventPath}/${file}`);
            this.events.set(event.name, event);
            console.log(event);
            this.on(event.name, event.run.bind(null, this));
        })
    }
}

export default ExtendedClient;