import { ApiExeption } from '@/lib/api'
import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'
import { WithParam } from '@/types/server'
import { NextResponse } from 'next/server'

export async function PATCH(
	req: Request,
	{ params: { serverId } }: WithParam<'serverId'>,
) {
	try {
		const profile = await getProfile()
		const { name, imageUrl } = await req.json()
		if (!profile) {
			return ApiExeption.throw(401)
		}

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
