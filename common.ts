import { ChannelType } from '@prisma/client'
import { Hash, Mic, Video } from 'lucide-react'

export const iconMap = {
	[ChannelType.TEXT]: Hash,
	[ChannelType.AUDIO]: Mic,
	[ChannelType.VIDEO]: Video,
}
