import {
	type MessariAssetMarketCapProps,
	type MessariAssetMarketDataProps,
} from '@matheustrres/messari-client';

type AssetModelProps = {
	id: string;
	name: string;
	symbol: string;
	marketCap: MessariAssetMarketCapProps;
	marketData: MessariAssetMarketDataProps;
};

export class MessariAssetModel {
	public readonly id: string;
	public readonly name: string;
	public readonly symbol: string;

	public readonly marketCap: MessariAssetMarketCapProps;
	public readonly marketData: MessariAssetMarketDataProps;

	public readonly rank: number;
	public readonly marketCapDominancePercent: number;
	public readonly currentMarketCapUSD: number;
	public readonly outstandingMarketCapUSD: number;
	public readonly realizedMarketCapUSD: number;
	public readonly priceUSD: number;
	public readonly realVolumeLast24h: number;
	public readonly percentChangeLast1hUSD: number;
	public readonly percentChangeLast24hUSD: number;
	public readonly lastTradeAt: string;

	constructor(props: AssetModelProps) {
		this.id = props.id;
		this.name = props.name;
		this.symbol = props.symbol;

		this.marketCap = props.marketCap;
		this.marketData = props.marketData;

		this.rank = this.marketCap.rank;
		this.marketCapDominancePercent = this.marketCap.marketcap_dominance_percent;
		this.currentMarketCapUSD = this.marketCap.current_marketcap_usd;
		this.outstandingMarketCapUSD = this.marketCap.outstanding_marketcap_usd;
		this.realizedMarketCapUSD = this.marketCap.realized_marketcap_usd;

		this.priceUSD = this.marketData.price_usd;
		this.realVolumeLast24h = this.marketData.real_volume_last_24_hours;
		this.percentChangeLast1hUSD =
			this.marketData.percent_change_usd_last_1_hour || 0;
		this.percentChangeLast24hUSD =
			this.marketData.percent_change_usd_last_24_hours || 0;
		this.lastTradeAt = this.marketData.last_trade_at || '0';
	}
}
