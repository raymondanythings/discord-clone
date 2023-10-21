import { ApiExeption } from '@/lib/api'
import { currentProfile } from '@/lib/current-profile'
import { db } from '@/lib/db'
import { WithParam } from '@/types/server'
import { MemberRole } from '@prisma/client'
import { NextResponse } from 'next/server'

export async function DELETE(
	req: Request,
	{ params: { channelId } }: WithParam<'channelId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)

		const { searchParams } = new URL(req.url)
		const serverId = searchParams.get('serverId')

		if (!serverId || !channelId) return ApiExeption.throw(400)

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					delete: {
						id: channelId,
						name: {
							not: 'general',
						},
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500)
	}
}

export async function PATCH(
	req: Request,
	{ params: { channelId } }: WithParam<'channelId'>,
) {
	try {
		const profile = await currentProfile()
		if (!profile) return ApiExeption.throw(401)

		const { searchParams } = new URL(req.url)
		const { name, type } = await req.json()
		const serverId = searchParams.get('serverId')

		if (!serverId || !channelId || name === 'general')
			return ApiExeption.throw(400)

		const server = await db.server.update({
			where: {
				id: serverId,
				members: {
					some: {
						profileId: profile.id,
						role: {
							in: [MemberRole.ADMIN, MemberRole.MODERATOR],
						},
					},
				},
			},
			data: {
				channels: {
					update: {
						where: {
							id: channelId,
							NOT: {
								name: 'general',
							},
						},
						data: {
							name,
							type,
						},
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500)
	}
}
