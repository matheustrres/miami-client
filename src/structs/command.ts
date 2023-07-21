import { type ApplicationCommandOptionData } from 'discord.js';

import MiamiClient from './client';

import { type CommmandPermissions, type CommandProps } from '@typings/index';

export default class Command {
	protected client: MiamiClient;
	private props: CommandProps;

	constructor(client: MiamiClient, props: CommandProps) {
		this.client = client;
		this.props = {
			...props,
			permissions: {
				clientPerms: props.permissions?.clientPerms ?? [],
				memberPerms: props.permissions?.memberPerms ?? [],
			},
		};
	}

	get name(): string {
		return this.props.name;
	}

	get description(): string {
		return this.props.description;
	}

	get category(): string {
		return this.props.category;
	}

	get options(): ApplicationCommandOptionData[] | undefined {
		return this.props.options;
	}

	get permissions(): CommmandPermissions | undefined {
		return this.props.permissions;
	}
}
