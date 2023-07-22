import type MiamiClient from './client';

import { EventProps } from '@typings/index';

export default abstract class Event {
	client: MiamiClient;
	name: string;

	constructor(props: EventProps) {
		this.client = props.client;
		this.name = props.name;
	}

	public abstract handle: (...args: any[]) => Promise<any> | any;
}
