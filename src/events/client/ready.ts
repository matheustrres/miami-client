import type MiamiClient from '@structs/client';
import Event from '@structs/event';

import { Logger } from '@utils/logger';

export default class ReadyEvent extends Event {
	private logger: Logger;

	constructor(client: MiamiClient) {
		super({
			client,
			name: 'ready',
		});

		this.logger = Logger.setTo(this.constructor.name);
	}

	public handle = async (): Promise<void> => {
		await this.client.loadSlashCommands();

		this.logger.info('Client successfully connected to Discord.js Api');
	};
}
