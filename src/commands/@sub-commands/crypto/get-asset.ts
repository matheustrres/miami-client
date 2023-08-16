import { type PickMetricsForAsset } from '@matheustrres/messari-client';

import { messariClient } from '@commands/others/crypto/client';
import { MessariAssetModel } from '@commands/others/crypto/models';

import type Context from '@structs/context';
import type SubCommand from '@structs/sub-command';

import { cacheManager } from '@utils/cache-manager';
import { buildEmbed } from '@utils/discord/builders';
import {
	formatTimestamp,
	shortenNumber,
	toCurrency,
} from '@utils/helpers/formatters';

type AssetWithMetrics = PickMetricsForAsset<['marketcap', 'market_data']>;

export class CryptoGetAssetSubCommand implements SubCommand {
	constructor(private readonly ctx: Context) {}

	public exec = async (assetName: string) => {
		let asset: AssetWithMetrics;

		const cachedAsset = (await cacheManager.get(
			`asset:${assetName}`,
		)) as AssetWithMetrics;

		if (cachedAsset) {
			asset = cachedAsset;
		} else {
			const { status, data } = await messariClient.getAsset<AssetWithMetrics>(
				assetName,
				{
					metrics: ['market_data', 'marketcap'],
				},
			);

			if (status.error_message) {
				const apiErrorMessages = {
					'Not Found':
						'Invalid asset name! All available assets available **[here](https://messari.io/screener/all-assets-D86E0735)**.',
				};

				const error: string =
					apiErrorMessages[
						status.error_message as keyof typeof apiErrorMessages
					] ||
					'Sorry, an unidentified error was found! Please, try again later.';

				return this.ctx.reply({
					ephemeral: true,
					content: error,
				});
			}

			asset = data as AssetWithMetrics;

			await cacheManager.set(`asset:${assetName}`, data);
		}

		const { id, marketCap, marketData, name, symbol } = new MessariAssetModel({
			id: asset.id,
			name: asset.name,
			symbol: asset.symbol,
			marketCap: asset.marketcap!,
			marketData: asset.market_data!,
		});

		const embedDescription: string[] = [
			`» \`Data\`:`,
			`ㅤ• Price: \`${toCurrency(
				marketData.priceUSD,
			)}\` (Changed \`${marketData.percentChangeLast1hUSD.toFixed(
				2,
			)}%\` in 1h, \`${marketData.percentChangeLast24hUSD.toFixed(
				2,
			)}%\` in 24h)`,
			`ㅤ• Volume in the last 24h: **${shortenNumber(
				marketData.realVolumeLast24h,
			)}**`,
			`ㅤ• Last transaction: ${formatTimestamp(
				marketData.lastTradeAt,
			)} (${formatTimestamp(marketData.lastTradeAt, 'R')})`,
			`» \`Market Capitalization\`:`,
			`ㅤ• Rank: :medal: ${marketCap.rank}`,
			` ㅤ• Dominance: **${marketCap.dominancePercent.toFixed(2)}%**`,
			`ㅤ• Current capital USD: \`${shortenNumber(
				marketCap.currentMarketCapUSD,
			)}\` (${toCurrency(marketCap.currentMarketCapUSD)})`,
			`ㅤ• Highlight capital USD: \`${shortenNumber(
				marketCap.outstandingMarketCapUSD,
			)}\` (${toCurrency(marketCap.outstandingMarketCapUSD)})`,
			`ㅤ• Paid-in capital USD: \`${shortenNumber(
				marketCap.realizedMarketCapUSD,
			)}\` (${toCurrency(marketCap.realizedMarketCapUSD)})`,
		];

		return this.ctx.reply({
			embeds: [
				buildEmbed({
					author: {
						name: `[${symbol}] ${name} (${id})`,
						iconURL: this.ctx.user.displayAvatarURL({
							extension: 'png',
							forceStatic: true,
						}),
					},
					description: embedDescription.join('\n'),
				}),
			],
		});
	};
}
