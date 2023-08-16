import { type InteractionResponse, type Message, codeBlock } from 'discord.js';

import type Context from '@structs/context';
import type SubCommand from '@structs/sub-command';

import { buildEmbed } from '@utils/discord/builders';
import { formatTimestamp } from '@utils/helpers/formatters';

type GithubProfile = {
	id: number;
	login: string;
	avatar_url: string;
	url: string;
	html_url: string;
	site_admin: boolean;
	name: string | null;
	company: string | null;
	blog: string;
	location: string | null;
	email: string | null;
	hireable: boolean | null;
	bio: string | null;
	public_repos: number;
	public_gists: number;
	followers: number;
	following: number;
	created_at: string;
	updated_at: string;
};

export class GithubUsersHandlerSubCommand implements SubCommand {
	constructor(private readonly ctx: Context) {}

	public exec = async (
		username: string,
	): Promise<Message | InteractionResponse> => {
		const res = await fetch(
			`https://api.github.com/users/${encodeURIComponent(username)}`,
		);

		if (res.status !== 200) {
			return this.ctx.reply({
				ephemeral: true,
				content: 'No profile found with this username.',
			});
		}

		const profile = (await res.json()) as GithubProfile;

		const embedDescription = [
			codeBlock(profile.bio ?? 'No biography defined'),
			`:calendar_spiral: Created at: ${formatTimestamp(profile.created_at)}`,
			`:calendar_spiral: Updated at: ${formatTimestamp(profile.updated_at)}`,
		];

		const embed = buildEmbed({
			author: {
				name: 'Github profiles',
			},
			title: `Profile from: ${profile.name} (AKA ${profile.login})`,
			description: embedDescription.join('\n'),
			fields: [
				{
					name: ':id: ID',
					value: `${profile.id}`,
					inline: true,
				},
				{
					name: ':man_police_officer: Admin',
					value: `${profile.site_admin ? 'Yes' : 'No'}`,
					inline: true,
				},
				{
					name: ':bookmark_tabs: Public repositories',
					value: `${profile.public_repos}`,
					inline: true,
				},
				{
					name: ':bookmark_tabs: Public gists',
					value: `${profile.public_gists}`,
					inline: true,
				},
				{
					name: ':busts_in_silhouette: Followers',
					value: `${profile.followers}`,
					inline: true,
				},
				{
					name: ':busts_in_silhouette: Following',
					value: `${profile.following}`,
					inline: true,
				},
			],
			thumbnail: {
				url: profile.avatar_url,
			},
			url: profile.html_url,
		});

		profile.location &&
			embed.addFields([
				{
					name: ':map: Location',
					value: profile.location,
					inline: true,
				},
			]);
		profile.email &&
			embed.addFields([
				{
					name: ':mail: Email',
					value: profile.email,
					inline: true,
				},
			]);
		profile.company &&
			embed.addFields([
				{
					name: ':computer: Company',
					value: profile.company,
					inline: true,
				},
			]);

		return this.ctx.reply({ embeds: [embed] });
	};
}
