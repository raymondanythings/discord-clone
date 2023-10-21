'use client'
import { useParams, useRouter } from 'next/navigation'

import { Member, Profile, Server } from '@prisma/client'

import { roleIconMap } from '@/common'
import { cn } from '@/lib/utils'

import UserAvatar from '@/components/user-avatar'
import { useCallback } from 'react'

interface ServerMemberProps {
	member: Member & { profile: Profile }
	server: Server
}

const ServerMember = ({ member, server }: ServerMemberProps) => {
	const params = useParams()
	const router = useRouter()

	const onClick = useCallback(() => {
		router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
	}, [member.id, params?.serverId, router])

	const Icon = roleIconMap[member.role]

	return (
		<button
			onClick={onClick}
			className={cn(
				'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover-bg-zinc-700/50 transition mb-1',
				params?.memberId === member.id && 'bg-zinc-700/20 dark:bg-zinc-700',
			)}
		>
			<UserAvatar
				src={member.profile.imageUrl}
				className="h-8 w-8 md:h-8 md:w-8"
			/>
			<p
				className={cn(
					'font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
					params?.memberId === member.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white',
				)}
			>
				{member.profile.name}
			</p>
			{Icon?.icon && <Icon.icon className={Icon.className} />}
		</button>
	)
}

export default ServerMember
