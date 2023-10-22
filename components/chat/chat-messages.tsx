'use client'

import { Loader2, ServerCrash } from 'lucide-react'

import { Member } from '@prisma/client'
import ChatWelcome from '@/components/chat/chat-welcome'
import { useChatQuery } from '@/hooks/use-chat-query'
import { Fragment } from 'react'
import ChatItem from '@/components/chat/chat-item'
import { format } from 'date-fns'
import { useChatSocket } from '@/hooks/use-chat-socket'
interface ChatMessagesProps {
	name: string
	member: Member
	chatId: string
	apiUrl: string
	socketUrl: string
	socketQuery: Record<string, string>
	paramKey: 'channelId' | 'conversationId'
	paramValue: string
	type: 'channel' | 'conversation'
}
const DATE_FORMAT = 'd MMM yyy, HH:mm '

const ChatMessages = ({
	apiUrl,
	chatId,
	member,
	name,
	paramKey,
	paramValue,
	socketQuery,
	socketUrl,
	type,
}: ChatMessagesProps) => {
	const queryKey = `chat:${chatId}`
	const addKey = `chat:${chatId}:messages`
	const updateKey = `chat:${chatId}:messages:update`
	const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
		useChatQuery({ queryKey, apiUrl, paramKey, paramValue })

	useChatSocket({ queryKey, addKey, updateKey })
	if (status === 'pending') {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<Loader2 className="w-7 h-7 text-zinc-500 animate-spin" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Loading messages...
				</p>
			</div>
		)
	}
	if (status === 'error') {
		return (
			<div className="flex flex-col flex-1 justify-center items-center">
				<ServerCrash className="w-7 h-7 text-zinc-500" />
				<p className="text-xs text-zinc-500 dark:text-zinc-400">
					Something went wrong!
				</p>
			</div>
		)
	}

	return (
		<div className="flex-1 flex flex-col py-4 overflow-y-auto">
			<div className="flex-1" />
			<ChatWelcome type={type} name={name} />
			<div className="flex flex-col-reverse mt-auto">
				{data?.pages?.map((group, i) => {
					return (
						<Fragment key={i}>
							{group.items.map((message) => (
								<ChatItem
									key={message.id}
									content={message.content}
									currentMember={member}
									member={message.member}
									deleted={message.deleted}
									fileUrl={message.fileUrl}
									id={message.id}
									isUpdated={message.updatedAt !== message.createdAt}
									timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
									socketQuery={socketQuery}
									socketUrl={socketUrl}
								/>
							))}
						</Fragment>
					)
				})}
			</div>
		</div>
	)
}

export default ChatMessages
