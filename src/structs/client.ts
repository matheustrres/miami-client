import nodeFs from 'node:fs';
import nodePath from 'node:path';

import { Client } from 'discord.js';

import type ClientCommand from './command';
import type ClientEvent from './event';

export default class MiamiClient extends Client {
	public commands: ClientCommand[];

	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 38671,
		});

		this.commands = [];

		this.loadEvents();
	}

	public login(token: string): Promise<string> {
		return super.login(token);
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

				if (evt.name === 'ready') {
					super.once('ready', (...args) => evt.run(...args));
				} else {
					super.on(evt.name, (...args) => evt.run(...args));
				}
			}
		}
	}
}
