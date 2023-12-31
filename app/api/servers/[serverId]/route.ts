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

		const { name, imageUrl } = await req.json()

		const server = await db.server.update({
			where: {
				id: serverId,
			},
			data: {
				name,
				imageUrl,
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		console.log('[SERVER_ID_PATCH]', error)
		return ApiExeption.throw(500)
	}
}
export async function DELETE(
	req: Request,
	{ params: { serverId } }: WithParam<'serverId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)
		if (!serverId) return ApiExeption.throw(400)

		const server = await db.server.delete({
			where: {
				id: serverId,
				profileId: profile.id,
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500)
	}
}
