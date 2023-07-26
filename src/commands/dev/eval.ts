import nodeUtil from 'node:util';

import {
	ApplicationCommandOptionType,
	ButtonStyle,
	ComponentType,
	type Interaction,
	codeBlock,
	type ButtonInteraction,
	type InteractionResponse,
	type ButtonBuilder,
} from 'discord.js';

import { envConfig } from '@config';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

import { buildActionRow, buildButton } from '@utils/discord/builders';

export default class EvalCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'eval',
			description: 'Execute a command in javascript',
			category: 'Dev',
			options: [
				{
					name: 'code',
					description: 'Code to be executed',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		});
	}

	private formatText = (text: string): string => {
		if (typeof text === 'string') {
			text
				.slice(0, 3000)
				.replace(/`/g, `\`${String.fromCharCode(8203)}`)
				.replace(/@/g, `@${String.fromCharCode(8203)}`)
				.replace(new RegExp(process.env.DISCORD_CLIENT_TOKEN, 'gi'), '****');
		}

		return text;
	};

	public run = async (ctx: Context): Promise<void> => {
		const code: string = ctx.interaction.options.getString('code', true);

		let interactionResponse: InteractionResponse;
		let result: string;

		try {
			let evalued = eval(code);

			if (evalued instanceof Promise) {
				evalued = await evalued;
			}

			const formattedResult: string = this.formatText(
				nodeUtil.inspect(evalued, {
					depth: 0,
				}),
			);

			result = codeBlock(formattedResult);

			if (result.length <= 3000) {
				const button = buildButton({
					custom_id: 'trash',
					emoji: {
						name: 'trashcan',
						id: '1002227364975083561',
						animated: false,
					},
					label: 'Delete',
					style: ButtonStyle.Danger,
				});

				const row = buildActionRow<ButtonBuilder>(button);

				interactionResponse = (await ctx.reply({
					content: result,
					components: [row],
				})) as InteractionResponse;
			} else {
				console.info('Result from eval: ', result);

				interactionResponse = (await ctx.reply({
					ephemeral: true,
					content: 'The result was sent to the console.',
				})) as InteractionResponse;
			}
		} catch (error) {
			console.error('An error has been found: ', error);

			result = (error as Error).message;
		}

		const collector = ctx.channel!.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 45_000,
			filter: (i: Interaction) => i.user.id === envConfig.discordOwnerId,
		});

		collector.on('collect', async (btn: ButtonInteraction): Promise<void> => {
			if (!btn.deferred) await btn.deferReply();

			switch (btn.customId) {
				case 'trash':
					await interactionResponse.delete();
					await btn.editReply({
						content: codeBlock('The result of this eval has been closed.'),
					});

					break;
				default:
					break;
			}
		});

		collector.on('end', async (): Promise<void> => {
			await interactionResponse.delete();
		});
	};
}
