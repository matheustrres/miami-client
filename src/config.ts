type EnvConfigProps = {
	discordToken: string;
	mainGuildId: string;
};

export const envConfig: EnvConfigProps = {
	discordToken: process.env.DISCORD_TOKEN as string,
	mainGuildId: process.env.MAIN_GUILD_ID as string,
};
