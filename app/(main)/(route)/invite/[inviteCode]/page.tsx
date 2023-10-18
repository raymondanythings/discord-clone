import CheckParamHOC, {
	WithParamAndState,
} from '@/components/hoc/check-param-hoc'
import { db } from '@/lib/db'
import { getProfile } from '@/lib/server'
import { WithParam } from '@/types/server'
import { Profile } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

const InviteCodePage = async ({
	params: { inviteCode },
	state: profile,
}: WithParamAndState<'inviteCode', Profile>) => {
	const server = await db.server.update({
		where: {
			inviteCode: inviteCode,
		},
		data: {
			members: {
				create: [
					{
						profileId: profile.id,
					},
				],
			},
		},
	})
	if (server) {
		return redirect(`/servers/${server.id}`)
	}
	return <></>
}

export default CheckParamHOC<'inviteCode', Profile>(
	InviteCodePage,
	'inviteCode',
	async (props) => {
		const {
			params: { inviteCode },
		} = props
		const profile = await getProfile()
		const existingServer = await db.server.findFirst({
			where: {
				inviteCode: inviteCode,
				members: {
					some: {
						profileId: profile.id,
					},
				},
			},
		})

		if (existingServer) {
			return redirect(`/servers/${existingServer.id}`)
		}

		return profile
	},
)
