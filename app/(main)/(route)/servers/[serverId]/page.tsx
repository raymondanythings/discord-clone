import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'
import { WithParam } from '@/types/server'
import { redirect } from 'next/navigation'
import React from 'react'

const ServerPage = async ({ params: { serverId } }: WithParam<'serverId'>) => {
	const profile = await getProfile()

	const server = await db.server.findUnique({
		where: {
			id: serverId,
			members: {
				some: {
					profileId: profile.id,
				},
			},
		},
		include: {
			channels: {
				where: {
					name: 'general',
				},
				orderBy: {
					createdAt: 'asc',
				},
			},
		},
	})

	const initialChannel = server?.channels[0]

	if (initialChannel?.name !== 'general') return null

	return redirect(`/servers/${serverId}/channels/${initialChannel.id}`)
}

export default ServerPage
