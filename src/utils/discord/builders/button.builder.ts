import {
	type APIMessageComponentEmoji,
	type ButtonStyle,
	ButtonBuilder,
	type ActionRowBuilder,
} from 'discord.js';

import { buildActionRow } from './action-row.builder';

export type ButtonBuilderProps = {
	custom_id: string;
	label: string;
	style: ButtonStyle;
	disabled?: boolean;
	emoji?: APIMessageComponentEmoji;
};

export const buildButton = (
	props: ButtonBuilderProps,
): ActionRowBuilder<ButtonBuilder> => {
	return buildActionRow<ButtonBuilder>(
		new ButtonBuilder({
			...props,
			disabled: props.disabled || false,
		}),
	);
};
