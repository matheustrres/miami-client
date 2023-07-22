import { type Interaction } from 'discord.js';
import { resolvePermissions } from 'src/utils/discord/resolvables/permissions';

import { envConfig } from '@config';

import MiamiClient from '@structs/client';
import Context from '@structs/context';
import Event from '@structs/event';

export default class InteractionCreateEvent extends Event {
	constructor(client: MiamiClient) {
		super({
			client,
			name: 'interactionCreate',
		});
	}

	public handle = async (interaction: Interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = this.client.commands.find(
				(cmd) => cmd.name === interaction.commandName,
			);

			if (command) {
				if (
					command.category === 'Dev' &&
					interaction.user.id !== envConfig.ownerId
				) {
					return interaction.reply({
						ephemeral: true,
						content: 'This command is restricted to my developer.',
					});
				}

				const cmdPerms = command.permissions;

				if (cmdPerms?.clientPerms?.length) {
					const clientHasEnoughPerms = interaction.appPermissions?.has(
						cmdPerms.clientPerms,
					);

					if (!clientHasEnoughPerms) {
						const clientMissingPermissions: string = resolvePermissions(
							cmdPerms.clientPerms,
						);

						return interaction.reply({
							ephemeral: true,
							content: `I need the following permissions to run this command: \n\`${clientMissingPermissions}\`.`,
						});
					}
				}

				if (cmdPerms?.memberPerms?.length) {
					const memberHasEnoughPerms = interaction.memberPermissions?.has(
						cmdPerms.memberPerms,
					);

					if (!memberHasEnoughPerms) {
						const memberMissingPerms: string = resolvePermissions(
							cmdPerms.memberPerms,
						);

						return interaction.reply({
							ephemeral: true,
							content: `You need the following permissions to run this command: \n\`${memberMissingPerms}\`.`,
						});
					}
				}

				const context = new Context(this.client, interaction);

				command.run(context);
			}
		}
	};
}
