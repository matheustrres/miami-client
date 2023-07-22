import { type PermissionResolvable, type Interaction, User } from 'discord.js';

import { envConfig } from '@config';

import MiamiClient from '@structs/client';
import Context from '@structs/context';
import Event from '@structs/event';

import { resolvePermissions } from '@utils/discord/resolvables/permissions';

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

				if (command.permissions?.clientPerms?.length) {
					const isMissing = checkMissingPermissions(
						interaction,
						this.client,
						command.permissions.clientPerms,
					);

					if (isMissing) {
						return interaction.reply({
							ephemeral: true,
							content: `I need the following permissions to run this command: \n\`${isMissing.permissions}\`.`,
						});
					}
				}

				if (command.permissions?.memberPerms?.length) {
					const isMissing = checkMissingPermissions(
						interaction,
						interaction.user,
						command.permissions.memberPerms,
					);

					if (isMissing) {
						return interaction.reply({
							ephemeral: true,
							content: `You need the following permissions to run this command: \n\`${isMissing.permissions}\`.`,
						});
					}
				}

				const context = new Context(this.client, interaction);

				command.run(context);
			}
		}
	};
}

const checkMissingPermissions = (
	interaction: Interaction,
	client: MiamiClient | User,
	cmdPerms: PermissionResolvable[],
) => {
	if (client instanceof MiamiClient) {
		if (!interaction.appPermissions?.has(cmdPerms)) {
			return {
				permissions: resolvePermissions(cmdPerms),
			};
		}
	}

	if (client instanceof User) {
		if (!interaction.memberPermissions?.has(cmdPerms)) {
			return {
				permissions: resolvePermissions(cmdPerms),
			};
		}
	}
};
