import {
	type ActionRowBuilder,
	ApplicationCommandOptionType,
	type ButtonBuilder,
	ButtonStyle,
	ComponentType,
	type Interaction,
} from 'discord.js';

import { MessariAssetModel } from './crypto/asset.model';
import { messariClient } from './crypto/client';

import type MiamiClient from '@structs/client';
import Command from '@structs/command';
import type Context from '@structs/context';

import {
	buildActionRow,
	buildButton,
	buildEmbed,
} from '@utils/discord/builders';
import {
	toCurrency,
	formatTimestamp,
	shortenNumber,
} from '@utils/helpers/formatters';

export default class CryptoCommand extends Command {
	constructor(client: MiamiClient) {
		super(client, {
			name: 'crypto',
			description: 'Get metrics of a crypto coin',
			category: 'Others',
			options: [
				{
					name: 'coin',
					description: 'The name of the coin',
					type: ApplicationCommandOptionType.String,
					required: true,
				},
			],
		});
	}

	private formatPercentage = (percentage: number): string => {
		const fixed: string = percentage.toFixed(2);

		let result: string;

		if (percentage < 0) result = `<:decline:1133507353518559403> \`${fixed}\``;
		else if (percentage > 0)
			result = `<:growth:1133507428256862349> \`${fixed}\``;
		else result = `\`${fixed}\``;

		return result;
	};

	public run = async (ctx: Context) => {
		const coinName: string = ctx.interaction.options.getString('coin', true);

		const { status, data } = await messariClient.getAssetMetrics(coinName);

		if (status.error_message != undefined) {
			let err: string;

			if (status.error_message === 'Asset not found') {
				const allAssets = 'https://messari.io/screener/all-assets-D86E0735';

				err = `Are you sure \`${coinName}\` is a valid asset? Check **[here](${allAssets})** the name of all available assets.`;
			} else {
				err =
					'Sorry, an unidentified error was found! Please, try again later.';
			}

			console.error(
				`An error has been found while trying to find an asset: `,
				status,
			);

			return ctx.reply({
				ephemeral: true,
				content: err,
			});
		}

		const asset = new MessariAssetModel({
			id: data!.id,
			name: data!.name,
			symbol: data!.symbol,
			marketCap: data!.marketcap,
			marketData: data!.market_data,
		});

		const lastTradeTimestamp = formatTimestamp(asset.lastTradeAt);
		const lastTradeAtTimestamp = formatTimestamp(asset.lastTradeAt, 'R');

		const mainEmbedDescription: string[] = [
			`» \`Data\`:`,
			`ㅤ• Price: \`${toCurrency(
				asset.priceUSD,
			)}\` (Changed \`${asset.percentChangeLast1hUSD.toFixed(
				2,
			)}%\` in 1h, \`${asset.percentChangeLast24hUSD.toFixed(2)}%\` in 24h)`,
			`ㅤ• Volume in the last 24h: **${shortenNumber(
				asset.realVolumeLast24h,
			)}**`,
			`ㅤ• Last transaction: ${lastTradeTimestamp} (${lastTradeAtTimestamp})`,
			`» \`Market Capitalization\`:`,
			`ㅤ• Rank: :medal: ${asset.rank}`,
			` ㅤ• Dominance: **${asset.marketCapDominancePercent.toFixed(2)}%**`,
			`ㅤ• Current capital USD: \`${shortenNumber(
				asset.currentMarketCapUSD,
			)}\` (${toCurrency(asset.currentMarketCapUSD)})`,
			`ㅤ• Highlight capital USD: \`${shortenNumber(
				asset.outstandingMarketCapUSD,
			)}\` (${toCurrency(asset.outstandingMarketCapUSD)})`,
			`ㅤ• Paid-in capital USD: \`${shortenNumber(
				asset.realizedMarketCapUSD,
			)}\` (${toCurrency(asset.realizedMarketCapUSD)})`,
		];

		const mainEmbed = buildEmbed({
			author: {
				name: `[${asset.symbol}] ${asset.name} (${asset.id})`,
				iconURL: this.client.user?.displayAvatarURL(),
			},
			description: mainEmbedDescription.join('\n'),
		});

		const nextPageButton: ButtonBuilder = buildButton({
			custom_id: 'next_page',
			emoji: {
				name: 'next',
				id: '1133479604686954637',
				animated: false,
			},
			label: 'Top Coins',
			style: ButtonStyle.Secondary,
		});

		const previousPageButton: ButtonBuilder = buildButton({
			custom_id: 'previous_page',
			emoji: {
				name: 'previous',
				id: '1011087460371017818',
				animated: false,
			},
			label: asset.name,
			style: ButtonStyle.Secondary,
			disabled: true,
		});

		const row: ActionRowBuilder<ButtonBuilder> = buildActionRow<ButtonBuilder>(
			nextPageButton,
			previousPageButton,
		);

		await ctx.reply({ embeds: [mainEmbed], components: [row] });

		const collector = ctx.channel!.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time: 240_000, // 4 minutes
			filter: (i: Interaction) => i.user.id === ctx.user.id,
		});

		collector.on('collect', async (btn): Promise<void> => {
			if (!btn.deferred) {
				await btn.deferUpdate().catch(() => {});
			}

			switch (btn.customId) {
				case 'next_page':
					row.components[0].setDisabled(true);
					row.components[1].setDisabled(false);

					const allAssets = await messariClient.listAllAssets();

					const slicedAssets = allAssets.data!.slice(0, 9);
					const sortedAssets = slicedAssets.sort(
						(x, y) =>
							y.metrics.market_data.price_usd - x.metrics.market_data.price_usd,
					);

					const description = sortedAssets.map((asset, i): string => {
						const { name, metrics } = asset;

						return `
                \`${i + 1}\` - **${name}** \`${toCurrency(
									metrics.market_data.price_usd,
								)}\` (${this.formatPercentage(
									metrics.market_data.percent_change_btc_last_24_hours || 0,
								)}% in 24h)
              `;
					});

					const embed = buildEmbed({
						title: 'Position | Asset | Price in USD',
						author: {
							name: 'Top assets in the moment',
						},
						description: description.join(''),
					});

					await btn.editReply({ embeds: [embed], components: [row] });

					break;

				case 'previous_page':
					row.components[0].setDisabled(false);
					row.components[1].setDisabled(true);

					await btn.editReply({ embeds: [mainEmbed], components: [row] });

					break;

				default:
					break;
			}

			collector.on('end', async (): Promise<void> => {
				await ctx.interaction.deleteReply();
			});
		});
	};
}
