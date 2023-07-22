import MiamiClient from '@structs/client';
import Event from '@structs/event';

export default class ReadyEvent extends Event {
	constructor(client: MiamiClient) {
		super({
			client,
			name: 'ready',
		});
	}

	public handle = async (): Promise<void> => {
		await this.client.loadSlashCommands();

		console.info('Client successfully connected to Discord.js Api');
	};
}
