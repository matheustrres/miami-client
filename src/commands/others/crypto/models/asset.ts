import {
	type MessariAPIMarketCapMetrics,
	type MessariAPIMarketDataMetrics,
} from '@matheustrres/messari-client';

import { MessariMarketCapModel } from './market-cap';
import { MessariMarketDataModel } from './market-data';

type AssetModelProps = {
	id: string;
	name: string;
	symbol: string;
	marketCap: MessariAPIMarketCapMetrics;
	marketData: MessariAPIMarketDataMetrics;
};

export class MessariAssetModel {
	public readonly id: string;
	public readonly name: string;
	public readonly symbol: string;

	public readonly marketCap: MessariMarketCapModel;
	public readonly marketData: MessariMarketDataModel;

	constructor(props: AssetModelProps) {
		this.id = props.id;
		this.name = props.name;
		this.symbol = props.symbol;

		this.marketCap = new MessariMarketCapModel(props.marketCap);
		this.marketData = new MessariMarketDataModel(props.marketData);
	}
}
