import {
	type APIMessageComponentEmoji,
	type ButtonStyle,
	ButtonBuilder,
} from 'discord.js';

export type ButtonBuilderProps = {
	custom_id: string;
	label: string;
	style: ButtonStyle;
	disabled?: boolean;
	emoji?: APIMessageComponentEmoji;
};

export const buildButton = (props: ButtonBuilderProps): ButtonBuilder =>
	new ButtonBuilder({
		...props,
		disabled: props.disabled || false,
	});
