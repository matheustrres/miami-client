import { type PickMetricsForAllAssets } from '@matheustrres/messari-client';

import { messariClient } from '@commands/others/crypto/client';

import type Context from '@structs/context';
import type SubCommand from '@structs/sub-command';

import { cacheManager } from '@utils/cache-manager';
import { buildEmbed } from '@utils/discord/builders';
import { toCurrency } from '@utils/helpers/formatters';

type AllAssetsWithMetrics = PickMetricsForAllAssets<['market_data']>;

const formatPercentage = (percentage: number): string => {
	const fixed = percentage.toFixed(2);
	const emoji = percentage < 0 ? '🔻' : percentage > 0 ? '🔼' : '';

	return `${emoji} \`${fixed}\``;
};

export class CryptoListTopAssetsSubCommand implements SubCommand {
	constructor(private readonly ctx: Context) {}

	public exec = async () => {
		let allAssets: AllAssetsWithMetrics[];

		const cachedAssets = (await cacheManager.get(
			'assets',
		)) as AllAssetsWithMetrics[];

		if (cachedAssets) {
			allAssets = cachedAssets;
		} else {
			const { data } = await messariClient.listAllAssets<
				AllAssetsWithMetrics[]
			>({
				metrics: ['market_data'],
			});

			allAssets = data as AllAssetsWithMetrics[];

			await cacheManager.set('assets', allAssets);
		}

		const embedDescription: string[] = allAssets
			.slice(0, 9)
			.sort(
				(x, y): number =>
					y.metrics.market_data!.price_usd - x.metrics.market_data!.price_usd,
			)
			.map((asset, i): string => {
				const { name, metrics } = asset;

				const priceUSD = toCurrency(metrics.market_data!.price_usd);
				const percentChange = formatPercentage(
					metrics.market_data!.percent_change_btc_last_24_hours || 0,
				);

				return `\`${
					i + 1
				}\` - **${name}** \`${priceUSD}\` (${percentChange}% in 24h)`;
			});

		return this.ctx.reply({
			embeds: [
				buildEmbed({
					title: 'Position | Asset | Price in USD',
					author: {
						name: 'Top assets in the moment',
					},
					description: embedDescription.join('\n'),
				}),
			],
		});
	};
}
