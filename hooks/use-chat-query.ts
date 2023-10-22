import qs from 'query-string'

import { useSocket } from '@/components/providers/socket-provider'
import { useInfiniteQuery } from '@tanstack/react-query'
import { Member, Message, Profile } from '@prisma/client'

interface ChatQueryProps {
	queryKey: string
	apiUrl: string
	paramKey: 'channelId' | 'conversationId'
	paramValue: string
}

export type MessageWithMemberWithProfile = Message & {
	member: Member & {
		profile: Profile
	}
}

export const useChatQuery = ({
	apiUrl,
	paramKey,
	paramValue,
	queryKey,
}: ChatQueryProps) => {
	const { isConnected } = useSocket()

	const fetchMessages = async ({ pageParam = 0 }) => {
		const url = qs.stringifyUrl(
			{
				url: apiUrl,
				query: {
					cursor: pageParam ? pageParam : undefined,
					[paramKey]: paramValue,
				},
			},
			{ skipNull: true },
		)

		const res = await fetch(url)
		return res.json() as Promise<{
			items: MessageWithMemberWithProfile[]
			nextCursor: number
		}>
	}

	return useInfiniteQuery({
		queryKey: [queryKey],
		queryFn: fetchMessages,
		initialPageParam: 0,
		getNextPageParam: (lastPage) => lastPage?.nextCursor,
		refetchInterval: isConnected ? false : 1000,
	})
}
