import nodeFs from 'node:fs';
import nodePath from 'node:path';

import { Client } from 'discord.js';

import type ClientCommand from './command';
import type ClientEvent from './event';

import { envConfig } from '@config';

export default class MiamiClient extends Client {
	public commands: ClientCommand[];
	public events: ClientEvent[];

	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 38671,
		});

		this.commands = [];
		this.events = [];

		this.loadCommands();
		this.loadEvents();
	}

	public login(token: string): Promise<string> {
		return super.login(token);
	}

	public async loadSlashCommands(): Promise<void> {
		if (!this.commands.length) {
			throw new Error('No commands have been loaded yet.');
		}

		await this.guilds.cache
			.get(envConfig.mainGuildId)
			?.commands.set(this.commands);
	}

	private loadCommands(path = 'src/commands'): void {
		const categories: string[] = nodeFs.readdirSync(path);

		for (const category of categories) {
			const commands: string[] = nodeFs.readdirSync(`${path}/${category}`);

			for (const command of commands) {
				const normalizedPath: string = nodePath.join(
					process.cwd(),
					`${path}/${category}/${command}`,
				);

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const Command = require(normalizedPath).default;
				const cmd = new Command(this) as ClientCommand;

				this.commands.push(cmd);
			}
		}

		console.log(`Total commands loaded: ${this.commands.length}`);
	}

	private loadEvents(path = 'src/events'): void {
		const categories: string[] = nodeFs.readdirSync(path);

		for (const category of categories) {
			const events: string[] = nodeFs.readdirSync(`${path}/${category}`);

			for (const event of events) {
				const normalizedPath: string = nodePath.join(
					process.cwd(),
					`${path}/${category}/${event}`,
				);

				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const Event = require(normalizedPath).default;
				const evt = new Event(this) as ClientEvent;

				this.events.push(evt);

				if (evt.name === 'ready') {
					super.once('ready', (...args) => evt.run(...args));
				} else {
					super.on(evt.name, (...args) => evt.run(...args));
				}
			}
		}

		console.log(`Total events loaded: ${this.events.length}`);
	}
}
