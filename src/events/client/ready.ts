import MiamiClient from '@structs/client';
import Event from '@structs/event';

export default class ReadyEvent extends Event {
	constructor(client: MiamiClient) {
		super({
			client,
			name: 'ready',
		});
	}

	public run = async (): Promise<void> => {
		console.info('Client successfully connected to Discord.js Api');
	};
}
