import { ApplicationCommandOptionType } from 'discord.js';

import { CryptoGetAssetSubCommand } from '@commands/@sub-commands/crypto/get-asset';
import { CryptoListTopAssetsSubCommand } from '@commands/@sub-commands/crypto/list-top-assets';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

export default class CryptoCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'crypto',
			description: 'just a test',
			category: 'Others',
			options: [
				{
					name: 'get',
					description: 'Get metadata and metrics for a coin',
					type: ApplicationCommandOptionType.Subcommand,
					options: [
						{
							name: 'coin',
							description: 'The coin name',
							type: ApplicationCommandOptionType.String,
							required: true,
						},
					],
				},
				{
					name: 'list',
					description: 'List top assets',
					type: ApplicationCommandOptionType.Subcommand,
				},
			],
		});
	}

	public run = async (ctx: Context) => {
		const subCommand: string = ctx.interaction.options.getSubcommand();

		switch (subCommand) {
			case 'get':
				new CryptoGetAssetSubCommand(ctx).exec(
					ctx.interaction.options.getString('coin', true),
				);

				break;

			case 'list':
				new CryptoListTopAssetsSubCommand(ctx).exec();

				break;

			default:
				break;
		}
	};
}
