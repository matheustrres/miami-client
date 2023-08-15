import { type MessariAPIMarketDataMetrics } from '@matheustrres/messari-client';

export class MessariMarketDataModel {
	public readonly priceUSD: number;
	public readonly realVolumeLast24h: number;
	public readonly percentChangeLast1hUSD: number;
	public readonly percentChangeLast24hUSD: number;
	public readonly lastTradeAt: string;

	constructor(marketData: MessariAPIMarketDataMetrics) {
		this.priceUSD = marketData.price_usd;
		this.realVolumeLast24h = marketData.real_volume_last_24_hours;
		this.percentChangeLast1hUSD =
			marketData.percent_change_usd_last_1_hour || 0;
		this.percentChangeLast24hUSD =
			marketData.percent_change_usd_last_24_hours || 0;
		this.lastTradeAt = marketData.last_trade_at || '0';
	}
}
