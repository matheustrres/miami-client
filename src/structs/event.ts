import type MiamiClient from './client';

import { EventProps, type IEvent } from '@typings/index';

export default class Event implements IEvent {
	client: MiamiClient;
	name: string;

	constructor(props: EventProps) {
		this.client = props.client;
		this.name = props.name;
	}

	run: (...args: any[]) => Promise<any> | any;
}
