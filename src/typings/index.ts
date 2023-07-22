import {
	type ApplicationCommandOptionData,
	type PermissionResolvable,
	type ClientEvents,
} from 'discord.js';

import type MiamiClient from '@structs/client';

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

export type EventProps = {
	client: MiamiClient;
	name: keyof ClientEvents;
};
