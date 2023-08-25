import { ApplicationCommandOptionType } from 'discord.js';

import { CurtoShortenLinkSubcommand } from '@commands/@sub-commands/curto/shorten-link';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

export default class CurtoCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'curto',
			description: 'Manage your Curto.io links',
			category: 'Others',
			options: [
				{
					name: 'shorten_link',
					description: 'Shorten a link with Curto',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'api_key',
							description: 'Your Curto API Key',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: 'link',
							description: 'The link to shorten',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: 'token',
							description: 'Text to identify your shortened link',
							type: ApplicationCommandOptionType.String,
						},
						{
							name: 'password',
							description: 'Text to protect your shortened link',
							type: ApplicationCommandOptionType.String,
						},
					],
				},
			],
		});
	}

	public run = async (ctx: Context) => {
		const apiKey = ctx.interaction.options.getString('api_key', true);
		const subCommand: string = ctx.interaction.options.getSubcommand(true);

		switch (subCommand) {
			case 'shorten_link':
				const link = ctx.interaction.options.getString('link', true);
				const token = ctx.interaction.options.getString('token');
				const password = ctx.interaction.options.getString('password');

				new CurtoShortenLinkSubcommand(ctx).exec(apiKey, {
					link,
					token,
					password,
				});

				break;
		}
	};
}
