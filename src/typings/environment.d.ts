export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			DISCORD_TOKEN: string;
			MAIN_GUILD_ID: string;
			OWNER_ID: string;
		}
	}
}