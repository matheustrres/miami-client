import { type MemoryCache, caching } from 'cache-manager';

export let cacheManager: MemoryCache;

const ONE_HOUR_IN_MS: number = 60 * 60 * 1000;

export default (async (): Promise<void> => {
	cacheManager = await caching('memory', {
		max: 50,
		ttl: ONE_HOUR_IN_MS,
	});
})();
