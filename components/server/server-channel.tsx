'use client'

import { iconMap } from '@/common'
import { cn } from '@/lib/utils'
import { Channel, MemberRole, Server } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'

import { ActionTooltip } from '@/components/action-tooltip'
import { Edit, Trash } from 'lucide-react'

interface ServerChannelProps {
	channel: Channel
	server: Server
	role?: MemberRole
}
const ServerChannel = ({ channel, server, role }: ServerChannelProps) => {
	const params = useParams()
	const router = useRouter()

	const Icon = iconMap[channel.type]
	return (
		<button
			onClick={() => {}}
			className={cn(
				'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
				params?.channelId === channel.id && 'bg-zinc-80020 dark:bg-zinc-700',
			)}
		>
			<Icon className="flex-shrink-0 w-5 h-5 text-zinc-500" />
			<p
				className={cn(
					'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
					params?.channelId === channel.id &&
						'text-primary dark:text-zinc-200 dark:group-hover:text-white',
				)}
			>
				{channel.name}
			</p>
			{channel.name !== 'general' && role !== MemberRole.GUEST && (
				<div className="ml-auto flex items-center gap-x-2">
					<ActionTooltip label="Edit">
						<Edit className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
					</ActionTooltip>
					<ActionTooltip label="Trash">
						<Trash className="hidden group-hover:block w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition" />
					</ActionTooltip>
				</div>
			)}
		</button>
	)
}

export default ServerChannel