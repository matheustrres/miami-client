import MiamiClient from './structs/client';

const client = new MiamiClient();

client.login(process.env.DISCORD_TOKEN).then(() => console.log('Client successfully logged in.'));