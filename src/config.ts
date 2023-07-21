type EnvConfigProps = {
	discordToken: string;
};

export const envConfig: EnvConfigProps = {
	discordToken: process.env.DISCORD_TOKEN as string,
};
