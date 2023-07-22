import { type InteractionResponse, type Message } from 'discord.js';

import MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

export default class PingCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'ping',
			description: 'Check client latency',
			category: 'Info',
		});
	}

	public run = async (ctx: Context): Promise<Message | InteractionResponse> => {
		const ping = this.client.ws.ping;

		return ctx.reply({
			content: `My current latency is \`${ping}ms\`.`,
			fetchReply: true,
		});
	};
}
