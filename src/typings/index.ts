import { type ClientEvents } from 'discord.js';

import type MiamiClient from '@structs/client';

export type EventProps = {
	client: MiamiClient;
	name: keyof ClientEvents;
};

export interface IEvent {
	run: <T = any>(...args: any[]) => Promise<T> | T;
}
