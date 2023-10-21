import type { Server as NetServer, Socket } from 'net'
import type { Server as SocketIOServer } from 'socket.io'
import { NextApiResponse } from 'next'
import { Channel, ChannelType, Member, Profile, Server } from '@prisma/client'
type s = Omit<{ id: string }, 'id'>
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

export type NextApiResponseServerIo = NextApiResponse & {
	socket: Socket & {
		server: NetServer & {
			io: SocketIOServer
		}
	}
}
