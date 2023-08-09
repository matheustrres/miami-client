import { MessariClient } from '@matheustrres/messari-client';

import { envConfig } from '@config';

export const messariClient = new MessariClient(envConfig.messariApiKey);
