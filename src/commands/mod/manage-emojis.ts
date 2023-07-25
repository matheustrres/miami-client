import {
	ApplicationCommandOptionType,
	type DiscordAPIError,
	type InteractionResponse,
	type Message,
} from 'discord.js';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

const guildEmojisPerBoostLevel = {
	0: 50,
	1: 100,
	2: 150,
	3: 250,
};

export default class ManageEmojisCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'emoji',
			description: 'Manage server emojis',
			category: 'Mod',
			options: [
				{
					name: 'add',
					description: 'Add an emoji to the server',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'name',
							description: 'The name of the emoji',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
						{
							name: 'url',
							description: 'The asset (URL) of the emoji',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					],
				},
			],
			permissions: {
				clientPerms: ['ManageGuildExpressions'],
				memberPerms: ['ManageGuildExpressions'],
			},
		});
	}

	public run = async (ctx: Context): Promise<Message | InteractionResponse> => {
		const emojiName = ctx.interaction.options.getString('name', true);
		const emojiURL = ctx.interaction.options.getString('url', true);

		if (
			ctx.guild!.emojis.cache.size >=
			guildEmojisPerBoostLevel[ctx.guild!.premiumTier]
		) {
			return ctx.reply({
				ephemeral: true,
				content:
					'This server no longer has slots available for emojis. Please consider raising its boost level.',
			});
		}

		let result: string;

		try {
			const emoji = await ctx.guild!.emojis.create({
				attachment: emojiURL,
				name: emojiName,
			});

			result = `The emoji ${emoji.animated ? '<a:' : '<:'}${emoji.name}:${
				emoji.id
			}> was successfully added.`;
		} catch (error) {
			console.error(
				'An error has been found while trying to create an emoji: ',
				error,
			);

			if (
				(error as DiscordAPIError).message ==
				'Asset exceeds maximum size: 33554432'
			) {
				result = 'The attachment provided is larger than 256kb';
			} else {
				result =
					'Sorry, an unidentified error was found! Please, try again later.';
			}
		}

		return ctx.reply({
			ephemeral: true,
			content: result,
		});
	};
}
