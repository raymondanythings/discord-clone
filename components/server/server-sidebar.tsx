import { redirect } from 'next/navigation'
import React from 'react'

import { db } from '@/lib/db'
import { ServerInfo } from '@/types/server'

import { ChannelType } from '@prisma/client'

import ServerHeader from './server-header'

interface ServerSidebarProps {
	serverId: string
	profileId: string
}

const ServerSidebar = async ({ serverId, profileId }: ServerSidebarProps) => {
	serverId

	const server = await db.server.findUnique({
		where: {
			id: serverId,
		},
		include: {
			channels: {
				orderBy: {
					createdAt: 'asc',
				},
			},
			members: {
				include: {
					profile: true,
				},
				orderBy: {
					role: 'asc',
				},
			},
		},
	})

	if (!server) return redirect('/')

	const serverInfo = server?.channels.reduce<ServerInfo>(
		(acc, cur) => {
			acc[cur.type].push(cur)
			return acc
		},
		{
			[ChannelType.AUDIO]: [],
			[ChannelType.VIDEO]: [],
			[ChannelType.TEXT]: [],
			loggedInUser: null,
		},
	)

	const members = server?.members.filter((member) => {
		const isNotLoggedInMember = member.profileId !== profileId
		if (!isNotLoggedInMember) {
			serverInfo.loggedInUser = member
		}
		return isNotLoggedInMember
	})
	return (
		<div className="flex flex-col h-full text-primary w-full dark:bg-[#2B2D31] bg-[#F2F3F5]">
			<ServerHeader server={server} role={serverInfo.loggedInUser?.role} />
			{server.channels.map((channel) => (
				<div key={channel.id}>{channel.name}</div>
			))}
		</div>
	)
}

export default ServerSidebar
