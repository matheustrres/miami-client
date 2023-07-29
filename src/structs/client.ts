import { Client } from 'discord.js';

import type Command from './command';
import type Event from './event';

import { envConfig } from '@config';

import { loadResources } from '@utils/helpers/load-resources';
import { Logger } from '@utils/logger';

export default class MiamiClient extends Client {
	private logger: Logger;

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

		this.logger = Logger.setTo(this.constructor.name);

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

		this.logger.info(
			'--------------------------------------------------------',
		);
		this.logger.info(
			'Initializing registration of Appplication (/) Commands...',
		);

		try {
			await this.guilds.cache
				.get(envConfig.discordMainGuildId)
				?.commands.set(this.commands);

			this.logger.info('Application (/) Commands successfully registered.');
		} catch (error) {
			this.logger.error(
				`Error while registering Application (/) commands: \n${error}`,
			);
		}

		this.logger.info(
			'--------------------------------------------------------',
		);
	}

	private loadCommands(): void {
		const commands = loadResources<Command>({
			client: this,
			resourceArray: this.commands,
			resourcePath: 'commands',
		});

		this.logger.info(`Total commands loaded: ${commands.length}`);
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

		this.logger.info(`Total events loaded: ${events.length}`);
	}
}
