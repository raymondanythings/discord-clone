import { Member, Profile } from '@prisma/client'
import React from 'react'

interface ChatItemProps {
	id: string
	content: string
	member: Member & {
		profile: Profile
	}
	timestamp: string
	fileUrl: string | null
	deleted: boolean
	currentMember: Member
	isUpdated: boolean
	socketUrl: string
	socketQuery: Record<string, string>
}

const ChatItem = ({
	content,
	currentMember,
	deleted,
	fileUrl,
	id,
	member,
	timestamp,
	isUpdated,
	socketQuery,
	socketUrl,
}: ChatItemProps) => {
	return <div></div>
}

export default ChatItem
