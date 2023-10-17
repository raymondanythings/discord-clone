import { Channel, ChannelType, Member, Profile, Server } from '@prisma/client'

export interface WithParam<S extends string> {
	params: {
		[key in S]: string
	}
}

type MappedChannels = {
	[key in ChannelType]: Channel[]
}

export interface ServerInfo extends MappedChannels {
	loggedInUser: Member | null
}

export type ServerWithMembersWithProfiles = Server & {
	members: (Member & { profile: Profile })[]
}
