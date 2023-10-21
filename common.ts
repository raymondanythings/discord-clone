import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

export const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
}
export const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: {
		icon: ShieldCheck,
		className: 'h-4 w-4 ml-2 text-indigo-500',
	},
	[MemberRole.ADMIN]: {
		icon: ShieldAlert,
		className: 'h-4 w-4 ml-2 text-rose-500',
	},
}
