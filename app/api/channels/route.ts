import { MemberRole } from '@prisma/client'

import { ApiExeption } from '@/lib/api'
import { db } from '@/lib/db'
import { NextResponse } from 'next/server'
import { currentProfile } from '@/lib/current-profile'

export async function POST(req: Request) {
	try {
		const profile = await currentProfile()

		if (!profile) return ApiExeption.throw(401)

		const { name, type } = await req.json()
		const { searchParams } = new URL(req.url)

		const serverId = searchParams.get('serverId')
		if (!serverId || name === 'general') return ApiExeption.throw(400)

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
					create: {
						profileId: profile.id,
						name,
						type,
					},
				},
			},
		})

		return NextResponse.json(server)
	} catch (error) {
		return ApiExeption.throw(500)
	}
}
