export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string;
			DISCORD_CLIENT_TOKEN: string;
			DISCORD_MAIN_GUILD_ID: string;
			DISCORD_OWNER_ID: string;
			MESSARI_API_KEY: string;
		}
	}
}
