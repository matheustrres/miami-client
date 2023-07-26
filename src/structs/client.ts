import { Client } from 'discord.js';

import type Command from './command';
import type Event from './event';

import { envConfig } from '@config';

import { loadResources } from '@utils/helpers/load-resources';

export default class MiamiClient extends Client {
	public commands: Command[] = [];
	public events: Event[] = [];

	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 38671,
		});

		this.loadEvents();
		this.loadCommands();
	}

	public login(token: string): Promise<string> {
		return super.login(token);
	}

	public async loadSlashCommands(): Promise<void> {
		if (!this.commands.length) {
			throw new Error('No commands have been loaded yet.');
		}

		await this.guilds.cache
			.get(envConfig.discordMainGuildId)
			?.commands.set(this.commands);
	}

	private loadCommands(): void {
		const commands = loadResources<Command>({
			client: this,
			resourceArray: this.commands,
			resourcePath: 'commands',
		});

		console.log(`Total commands loaded: ${commands.length}`);
	}

	private loadEvents(): void {
		const events = loadResources<Event>({
			client: this,
			resourceArray: this.events,
			resourcePath: 'events',
		});

		for (const event of events) {
			if (event.name === 'ready') {
				super.once('ready', (...args: any[]): any => event.handle(...args));
			} else {
				super.on(event.name, (...args: any[]): any => event.handle(...args));
			}
		}

		console.log(`Total events loaded: ${events.length}`);
	}
}
