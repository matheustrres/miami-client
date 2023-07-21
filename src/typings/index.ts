import {
	type ApplicationCommandOptionData,
	type PermissionResolvable,
	type ClientEvents,
	type Message,
	type InteractionResponse,
} from 'discord.js';

import type MiamiClient from '@structs/client';
import type Context from '@structs/context';

export type CommandCategory = 'Dev' | 'Info' | 'Mod' | 'Others';
export type CommmandPermissions = {
	clientPerms?: PermissionResolvable[];
	memberPerms?: PermissionResolvable[];
};

export type CommandProps = {
	name: string;
	description: string;
	category: CommandCategory;
	options?: ApplicationCommandOptionData[];
	permissions?: CommmandPermissions;
};

export interface ICommand {
	run: (ctx: Context) => Promise<Message | InteractionResponse>;
}

export type EventProps = {
	client: MiamiClient;
	name: keyof ClientEvents;
};

export interface IEvent {
	run: <T = any>(...args: any[]) => Promise<T> | T;
}
