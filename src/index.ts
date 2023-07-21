import { envConfig } from './config';
import MiamiClient from './structs/client';

const client = new MiamiClient();

client.login(envConfig.discordToken);

client.on('ready', (): void => {
	console.log('Client successfully connected to Discord.js Api');
});
