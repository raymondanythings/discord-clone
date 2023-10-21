import { redirect } from 'next/navigation'
import React, { createElement } from 'react'
import { ChannelType, MemberRole } from '@prisma/client'

import { ServerInfo } from '@/types/server'

import { db } from '@/lib/db'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import ServerHeader from './server-header'
import ServerSearch from './server-search'
import ServerSection from './server-section'

import { ShieldAlert, ShieldCheck } from 'lucide-react'
import ServerChannel from './server-channel'
import { iconMap } from '@/common'
import ServerMember from './server-member'

interface ServerSidebarProps {
	serverId: string
	profileId: string
}

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-red-500" />,
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
								data: serverInfo.TEXT.map((channel) => {
									return {
										id: channel.id,
										name: channel.name,
										icon: createElement(iconMap[channel.type], {
											className: 'mr-2 h-4 w-4',
										}),
									}
								}),
							},
							{
								label: 'Voice Channles',
								type: 'channel',
								data: serverInfo.AUDIO.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: createElement(iconMap[channel.type], {
										className: 'mr-2 h-4 w-4',
									}),
								})),
							},
							{
								label: 'Video Channels',
								type: 'channel',
								data: serverInfo.VIDEO.map((channel) => ({
									id: channel.id,
									name: channel.name,
									icon: createElement(iconMap[channel.type], {
										className: 'mr-2 h-4 w-4',
									}),
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
				<Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />

				<div className="mb-2">
					<ServerSection
						sectionType="channels"
						channelType={ChannelType.TEXT}
						role={serverInfo.loggedInUser?.role}
						label="Text Channels"
					/>
					<div className="space-y-[2px]">
						{serverInfo.TEXT.map((channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={serverInfo.loggedInUser?.role}
							/>
						))}
					</div>
				</div>
				<div className="mb-2">
					<ServerSection
						sectionType="channels"
						channelType={ChannelType.VIDEO}
						role={serverInfo.loggedInUser?.role}
						label="Video Channels"
					/>
					<div className="space-y-[2px]">
						{serverInfo.VIDEO.map((channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={serverInfo.loggedInUser?.role}
							/>
						))}
					</div>
				</div>
				<div className="mb-2">
					<ServerSection
						sectionType="channels"
						channelType={ChannelType.AUDIO}
						role={serverInfo.loggedInUser?.role}
						label="Audio Channels"
					/>
					<div className="space-y-[2px]">
						{serverInfo.AUDIO.map((channel) => (
							<ServerChannel
								key={channel.id}
								server={server}
								channel={channel}
								role={serverInfo.loggedInUser?.role}
							/>
						))}
					</div>
				</div>
				<div className="mb-2">
					<ServerSection
						sectionType="members"
						role={serverInfo.loggedInUser?.role}
						label="Members"
						server={server}
					/>
					<div className="space-y-[2px]">
						{members.map((member) => (
							<ServerMember key={member.id} member={member} server={server} />
						))}
					</div>
				</div>
			</ScrollArea>
		</div>
	)
}

export default ServerSidebar
