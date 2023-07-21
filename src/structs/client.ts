import { Client } from 'discord.js';

export default class MiamiClient extends Client {
	constructor() {
		super({
			allowedMentions: {
				parse: ['roles', 'users'],
				repliedUser: true,
			},
			intents: 38671,
		});
	}

	public login(token: string): Promise<string> {
		return super.login(token);
	}
}
