import { db } from '@/lib/db'
import React from 'react'

interface ServerSidebarProps {
	serverId: string
}
const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
	serverId

	const channels = await db.server.findMany({
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
			},
		},
	})

	return (
		<div>
			{channels.map((channel) => (
				<div key={channel.id}>{channel.name}</div>
			))}
		</div>
	)
}

export default ServerSidebar
