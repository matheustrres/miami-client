import { type TimestampStylesString, time } from 'discord.js';

type CommonOptions = {
	currency?: string;
	locale?: string;
};

const defaultCurrency = 'USD';

export const formatTimestamp = (
	date?: string | number | Date,
	style: TimestampStylesString = 'f',
): string =>
	date?.toString() === '0' ? '00/00/0000' : time(new Date(date as Date), style);

export const shortenNumber = (
	number: number,
	options?: CommonOptions,
): string =>
	new Intl.NumberFormat(options?.locale, {
		notation: 'compact',
		currency: options?.currency ?? defaultCurrency,
		currencyDisplay: 'narrowSymbol',
		maximumFractionDigits: 3,
		unitDisplay: 'short',
		style: 'currency',
	}).format(number);

export const toCurrency = (number: number, options?: CommonOptions): string =>
	new Intl.NumberFormat(options?.locale, {
		style: 'currency',
		currency: options?.currency ?? defaultCurrency,
	}).format(number);
