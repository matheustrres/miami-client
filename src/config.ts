type EnvConfigProps = {
	discordClientToken: string;
	discordMainGuildId: string;
	discordOwnerId: string;
	messariApiKey: string;
};

export const envConfig: EnvConfigProps = {
	discordClientToken: process.env.DISCORD_CLIENT_TOKEN as string,
	discordMainGuildId: process.env.MAIN_GUILD_ID as string,
	discordOwnerId: process.env.OWNER_ID as string,
	messariApiKey: process.env.MESSARI_API_KEY as string,
};
