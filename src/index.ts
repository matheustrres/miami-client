import './utils/module-alias';

import { envConfig } from './config';
import MiamiClient from './structs/client';

const client = new MiamiClient();

client.login(envConfig.discordClientToken);
