import { redirectToSignIn } from '@clerk/nextjs'
import { currentProfile } from './current-profile'
import { Profile } from '@prisma/client'
import { ApiExeption } from './api'

export const getProfile = async (): Promise<Profile> => {
	const profile = await currentProfile()
	if (!profile) return redirectToSignIn()

	return profile
}
