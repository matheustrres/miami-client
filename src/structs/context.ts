import {
	type APIInteractionGuildMember,
	type ChatInputCommandInteraction,
	type Guild,
	type GuildMember,
	type InteractionReplyOptions,
	type InteractionResponse,
	type Message,
	type TextBasedChannel,
	type User,
} from 'discord.js';

import type MiamiClient from './client';

export default class Context {
	constructor(
		private readonly client: MiamiClient,
		private readonly _interaction: ChatInputCommandInteraction,
	) {}

	get channel(): TextBasedChannel | null {
		return this.interaction.channel;
	}

	get guild(): Guild | null {
		return this.interaction.guild;
	}

	get member(): GuildMember | APIInteractionGuildMember | null {
		return this.interaction.member;
	}

	get user(): User {
		return this.interaction.user;
	}

	get interaction(): ChatInputCommandInteraction {
		return this._interaction;
	}

	public async reply(
		options: InteractionReplyOptions,
	): Promise<Message | InteractionResponse> {
		if (!options.content) options.content = '';

		return this.interaction.deferred
			? await this.interaction.editReply(options)
			: await this.interaction.reply(options);
	}
}
