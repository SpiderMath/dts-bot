import { Event } from "../Interfaces/Event"

export const event: Event = {
    name: "ready",
    run: (client) => {
        console.log(`I am up and running! 🥳`);
    }
}