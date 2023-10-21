import ChatHeader from '@/components/chat/chat-header'
import { getOrCreateConversation } from '@/lib/conversation'
import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'
import { WithParam } from '@/types/server'
import { redirect } from 'next/navigation'

const MemberIdPage = async ({
	params: { memberId, serverId },
}: WithParam<'serverId' | 'memberId'>) => {
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
		</div>
	)
}

export default MemberIdPage
