'use client'
import qs from 'query-string'
import axios from 'axios'

import { MemberRole } from '@prisma/client'
import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import UserAvatar from '@/components/user-avatar'

import { ServerWithMembersWithProfiles } from '@/types/server'

import { useModal } from '@/hooks/use-modal-store'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

const roleIconMap = {
	[MemberRole.GUEST]: null,
	[MemberRole.MODERATOR]: (
		<ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />
	),
	[MemberRole.ADMIN]: <ShieldAlert className="h-4 w-4 text-rose-500" />,
}

const MembersModal = () => {
	const router = useRouter()
	const { onOpen, onClose, type, isOpen, data } = useModal()
	const [loadingId, setLoadingId] = useState('')

	const { server } = data as { server?: ServerWithMembersWithProfiles }
	const isModalOpen = isOpen && type === 'MEMBERS'

	const membersCount = useMemo(
		() => server?.members.length ?? 0,
		[server?.members?.length],
	)

	const onKick = async (memberId: string) => {
		try {
			setLoadingId(memberId)
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			})
			const response = await axios.delete(url)
			router.refresh()
			onOpen('MEMBERS', { server: response.data })
		} catch (error) {
			console.log('[ERROR : onKick] ', error)
		} finally {
			setLoadingId('')
		}
	}

	const onRoleChange = async (memberId: string, role: MemberRole) => {
		try {
			setLoadingId(memberId)
			const url = qs.stringifyUrl({
				url: `/api/members/${memberId}`,
				query: {
					serverId: server?.id,
				},
			})

			const response = await axios.patch(url, { role })
			router.refresh()
			onOpen('MEMBERS', { server: response.data })
		} catch (error) {
			console.log('[ERROR : onRoleChange] ', error)
		} finally {
			setLoadingId('')
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Manage Members
					</DialogTitle>
				</DialogHeader>
				<DialogDescription className="text-center text-zinc-500">
					{membersCount} Member{membersCount > 0 ? 's' : ''}
				</DialogDescription>
				<ScrollArea>
					{server?.members?.map((member) => (
						<div key={member.id} className="flex items-center gap-x-2 mb-6">
							<UserAvatar src={member.profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{member.profile.name}
									{roleIconMap[member.role]}
								</div>
								<p className="text-xs text-zinc-500">{member.profile.email}</p>
							</div>
							{server.profileId !== member.profileId &&
								loadingId !== member.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="w-4 h-4 text-zinc-500" />
											</DropdownMenuTrigger>
											<DropdownMenuContent side="left">
												<DropdownMenuSub>
													<DropdownMenuSubTrigger className="flex items-center">
														<ShieldQuestion className="w-4 h-4 mr-2" />
														<span>Role</span>
													</DropdownMenuSubTrigger>
													<DropdownMenuPortal>
														<DropdownMenuSubContent>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, MemberRole.GUEST)
																}
															>
																<Shield className="h-4 w-4 mr-2" />
																Guest
																{member.role === 'GUEST' && (
																	<Check className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() =>
																	onRoleChange(member.id, MemberRole.MODERATOR)
																}
															>
																<ShieldCheck className="h-4 w-4 mr-2" />
																Moderator
																{member.role === 'MODERATOR' && (
																	<Check className="h-4 w-4 ml-auto" />
																)}
															</DropdownMenuItem>
														</DropdownMenuSubContent>
													</DropdownMenuPortal>
												</DropdownMenuSub>
												<DropdownMenuSeparator />
												<DropdownMenuItem onClick={() => onKick(member.id)}>
													<Gavel className="h-4 w-4 mr-2" />
													Kick
												</DropdownMenuItem>
											</DropdownMenuContent>
										</DropdownMenu>
									</div>
								)}
							{loadingId === member.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto w-4 h-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	)
}

export default MembersModal
