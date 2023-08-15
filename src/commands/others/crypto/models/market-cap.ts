import { type MessariAPIMarketCapMetrics } from '@matheustrres/messari-client';

export class MessariMarketCapModel {
	public rank: number;
	public dominancePercent: number;
	public currentMarketCapUSD: number;
	public outstandingMarketCapUSD: number;
	public realizedMarketCapUSD: number;

	constructor(marketCap: MessariAPIMarketCapMetrics) {
		this.rank = marketCap.rank;
		this.dominancePercent = marketCap.marketcap_dominance_percent;
		this.currentMarketCapUSD = marketCap.current_marketcap_usd;
		this.outstandingMarketCapUSD = marketCap.outstanding_marketcap_usd;
		this.realizedMarketCapUSD = marketCap.realized_marketcap_usd;
	}
}
