import { ApiExeption } from '@/lib/api'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { WithParam } from '@/types/server'
import { NextResponse } from 'next/server'

export async function DELETE(
	req: Request,
	{ params: { memberId } }: WithParam<'memberId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')

		if (!serverId) return ApiExeption.throw(400)
		if (!memberId) return ApiExeption.throw(400)

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					deleteMany: {
						id: memberId,
						profileId: {
							not: profile.id,
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: 'asc',
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500, 'MEMBERS_ID_PATCH', error)
	}
}

export async function PATCH(
	req: Request,
	{ params: { memberId } }: WithParam<'memberId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)
		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')
		const { role } = await req.json()

		if (!serverId) return ApiExeption.throw(400)
		if (!memberId) return ApiExeption.throw(400)

		const server = await db.server.update({
			where: {
				id: serverId,
				profileId: profile.id,
			},
			data: {
				members: {
					update: {
						data: {
							role,
						},
						where: {
							id: memberId,
							profileId: {
								not: profile.id,
							},
						},
					},
				},
			},
			include: {
				members: {
					include: {
						profile: true,
					},
					orderBy: {
						role: 'asc',
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500, 'MEMBERS_ID_PATCH', error)
	}
}
