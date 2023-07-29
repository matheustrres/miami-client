import { ApplicationCommandOptionType } from 'discord.js';

import { githubUserHandler } from './github/github-user.handler';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

export default class GithubCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'github',
			description: 'Get data from Github',
			category: 'Others',
			options: [
				{
					name: 'users',
					description: 'Get user data on github',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'username',
							description: 'Github username',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					],
				},
			],
			permissions: {
				clientPerms: ['EmbedLinks'],
			},
		});
	}

	public run = async (ctx: Context) => {
		const subCommand = ctx.interaction.options.getSubcommand(true);

		if (subCommand === 'users') {
			return githubUserHandler(
				ctx,
				ctx.interaction.options.getString('username', true),
			);
		}
	};
}
