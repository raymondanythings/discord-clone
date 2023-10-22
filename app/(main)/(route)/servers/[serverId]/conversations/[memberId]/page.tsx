import { getOrCreateConversation } from '@/lib/conversation'
import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'
import { WithParam } from '@/types/server'
import { redirect } from 'next/navigation'

import ChatHeader from '@/components/chat/chat-header'
import ChatInput from '@/components/chat/chat-input'
import ChatMessages from '@/components/chat/chat-messages'
import MediaRoom from '@/components/media-room'

interface MemberIdPageProps extends WithParam<'serverId' | 'memberId'> {
	searchParams: {
		video?: boolean
	}
}

const MemberIdPage = async ({
	params: { memberId, serverId },
	searchParams,
}: MemberIdPageProps) => {
	const profile = await getProfile()

	const currentMember = await db.member.findFirst({
		where: {
			serverId,
			profileId: profile.id,
		},
		include: {
			profile: true,
		},
	})

	if (!currentMember) {
		return redirect('/')
	}

	const conversation = await getOrCreateConversation(currentMember.id, memberId)
	if (!conversation) return redirect(`/servers/${serverId}`)

	const { memberOne, memberTwo } = conversation

	const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne
	return (
		<div className="bg-white dark:bg-[#313338] flex flex-col h-full">
			<ChatHeader
				profile={profile}
				imageUrl={otherMember.profile.imageUrl}
				name={otherMember.profile.name}
				serverId={serverId}
				type="conversation"
			/>
			{!searchParams?.video ? (
				<>
					<ChatMessages
						member={currentMember}
						name={otherMember.profile.name}
						chatId={conversation.id}
						type="conversation"
						apiUrl="/api/direct-messages"
						paramKey="conversationId"
						paramValue={conversation.id}
						socketUrl="/api/socket/direct-messages"
						socketQuery={{ conversationId: conversation.id }}
					/>
					<ChatInput
						name={otherMember.profile.name}
						type="conversation"
						apiUrl="/api/socket/direct-messages"
						query={{
							conversationId: conversation.id,
						}}
					/>
				</>
			) : (
				<MediaRoom chatId={conversation.id} video audio />
			)}
		</div>
	)
}

export default MemberIdPage
