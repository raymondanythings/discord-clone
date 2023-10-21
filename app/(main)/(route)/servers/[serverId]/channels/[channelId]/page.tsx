import { redirect } from 'next/navigation'

import { WithParam } from '@/types/server'

import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'

import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'

const ChannelIdPage = async ({
	params: { channelId, serverId },
}: WithParam<'serverId' | 'channelId'>) => {
	const profile = await getProfile()

	const findChannelPromise = db.channel.findUnique({
		where: {
			id: channelId,
		},
	})

	const findMemberPromise = db.member.findFirst({
		where: {
			serverId,
			profileId: profile.id,
		},
	})

	const [channel, member] = await Promise.all([
		findChannelPromise,
		findMemberPromise,
	])
	if (!channel || !member) redirect('/')

	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				name={channel.name}
				serverId={serverId}
				profile={profile}
				type="channel"
			/>
			<ChatMessages
				member={member}
				name={channel.name}
				chatId={channel.id}
				type="channel"
				apiUrl="/api/messages"
				socketUrl="/api/socket/messages"
				socketQuery={{ channelId: channel.id, serverId: channel.serverId }}
				paramKey="channelId"
				paramValue={channel.id}
			/>
			<ChatInput
				name={channel.name}
				type="channel"
				apiUrl="/api/socket/messages"
				query={{
					channelId: channel.id,
					serverId: channel.serverId,
				}}
			/>
		</div>
	)
}

export default ChannelIdPage
