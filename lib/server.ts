import { redirectToSignIn } from '@clerk/nextjs'
import { currentProfile } from './current-profile'
import { Profile } from '@prisma/client'

export const getProfile = async (): Promise<Profile> => {
	const profile = await currentProfile()
	if (!profile) return redirectToSignIn()

	return profile
}
import { NextApiResponse, NextApiRequest } from 'next'
import { NextApiResponseServerIo } from '@/types/server'

export interface ResponseType {
	ok?: boolean
	[key: string]: any
}

type method = 'GET' | 'POST' | 'PATCH' | 'DELETE'

interface ConfigType<T> {
	methods: method[]
	handler: (req: NextApiRequest, res: NextApiResponseServerIo) => Promise<T>
	isPrivate?: boolean
}

export function withHandler<T = any>({ methods, handler }: ConfigType<T>) {
	return async function (
		req: NextApiRequest,
		res: NextApiResponseServerIo,
	): Promise<any> {
		if (req.method && !methods.includes(req.method as any)) {
			return res.status(405).json({ error: 'Method not allowed' })
		}

		try {
			await handler(req, res)
		} catch (error) {
			console.error(error)
			return res.status(500).json({ error })
		}
	}
}
