import { redirect } from 'next/navigation'
import React from 'react'
import { ChannelType, MemberRole } from '@prisma/client'

import { ServerInfo } from '@/types/server'

import { db } from '@/lib/db'

import { ScrollArea } from '@/components/ui/scroll-area'

import ServerHeader from './server-header'
import ServerSearch from './server-search'

import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

interface ServerSidebarProps {
	serverId: string
	profileId: string
}

const iconMap = {
	[ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
	[ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
	[ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-indigo-500" />,
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
			<ScrollArea className="flex-1 px-3">
				<div className="mt-2">
					<ServerSearch
						data={[
							{
								label: 'Text Channles',
								type: 'channel',
								data: serverInfo.TEXT.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Voice Channles',
								type: 'channel',
								data: serverInfo.AUDIO.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Video Channles',
								type: 'channel',
								data: serverInfo.VIDEO.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: iconMap[channel.type],
								})),
							},
							{
								label: 'Members',
								type: 'member',
								data: members.map((member) => ({
									id: member.id,
									name: member.profile.name,
									icon: roleIconMap[member.role],
								})),
							},
						]}
					/>
				</div>
				{server.channels.map((channel) => (
					<div key={channel.id}>{channel.name}</div>
				))}
			</ScrollArea>
		</div>
	)
}

export default ServerSidebar
