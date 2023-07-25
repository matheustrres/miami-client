import {
	type APIEmbedField,
	type APIEmbedFooter,
	type APIEmbedThumbnail,
	type EmbedAuthorOptions,
	EmbedBuilder,
} from 'discord.js';

type EmbedBuilderProps = {
	author: EmbedAuthorOptions;
	description?: string;
	fields?: APIEmbedField[];
	footer?: APIEmbedFooter;
	thumbnail?: APIEmbedThumbnail;
	title?: string;
	url?: string;
};

export const buildEmbed = (props: EmbedBuilderProps): EmbedBuilder =>
	new EmbedBuilder({
		author: props.author,
		color: 2895667,
		description: props.description,
		fields: props.fields || [],
		footer: props.footer,
		thumbnail: props.thumbnail,
		timestamp: Date.now(),
		title: props.title,
		url: props.url,
	});
