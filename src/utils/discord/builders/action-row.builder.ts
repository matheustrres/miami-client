import {
	type AnyComponentBuilder,
	ActionRowBuilder,
	type RestOrArray,
} from 'discord.js';

export const buildActionRow = <T extends AnyComponentBuilder>(
	...components: RestOrArray<T>
): ActionRowBuilder<T> => {
	return new ActionRowBuilder<T>().addComponents(...components);
};
