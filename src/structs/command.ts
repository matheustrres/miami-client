import { type ApplicationCommandOptionData } from 'discord.js';

import type MiamiClient from './client';
import type Context from './context';

import {
	type CommmandPermissions,
	type CommandProps,
	type CommandCategory,
} from '@typings/index';

export default abstract class Command {
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

	get category(): CommandCategory {
		return this.props.category;
	}

	get options(): ApplicationCommandOptionData[] | undefined {
		return this.props.options;
	}

	get permissions(): CommmandPermissions | undefined {
		return this.props.permissions;
	}

	public abstract run: (ctx: Context) => Promise<any>;
}
