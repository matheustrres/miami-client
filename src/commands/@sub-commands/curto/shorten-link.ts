import { type InteractionResponse, type Message } from 'discord.js';

import type Context from '@structs/context';
import type SubCommand from '@structs/sub-command';

import { formatTimestamp } from '@utils/helpers/formatters';

type ShortenLinkProps = {
	link: string;
	token?: string | null;
	password?: string | null;
};

type ShortenLink = {
	data: {
		id: string;
		destination: string;
		token: string;
		short_link: string;
		domain: string;
		domain_id: string;
		password: boolean;
		created_at: string;
		updated_at: string;
		clicks: number;
	};
};

export class CurtoShortenLinkSubcommand implements SubCommand {
	constructor(private readonly ctx: Context) {}

	public exec = async (
		apiKey: string,
		props: ShortenLinkProps,
	): Promise<Message | InteractionResponse> => {
		const response = await fetch(new URL(`https://api.curto.io/v1/links`), {
			method: 'POST',
			mode: 'cors',
			body: JSON.stringify(props),
			headers: {
				'Content-Type': 'application/json',
				'X-Curto-Api-Key': apiKey,
			},
		});

		const { data } = (await response.json()) as ShortenLink;

		const content: string[] = [
			`ID: ${data.id}`,
			`Short link: **${data.short_link}**`,
			`Destination: **${data.destination}**`,
			`Token: ${data.token}`,
			`Password: ${data.password}`,
			`Created At: ${formatTimestamp(data.created_at)}`,
		];

		return this.ctx.reply({
			content: content.join('\n'),
		});
	};
}
