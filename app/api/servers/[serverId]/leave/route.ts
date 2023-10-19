import { ApiExeption } from '@/lib/api'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'

import { WithParam } from '@/types/server'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params: { serverId } }: WithParam<'serverId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)
		if (!serverId) return ApiExeption.throw(400)

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: {
					not: profile.id,
				},
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
			data: {
				members: {
					deleteMany: {
						profileId: profile.id,
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500)
	}
}
