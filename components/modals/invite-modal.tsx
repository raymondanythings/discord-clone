'use client'
import axios from 'axios'

import { Check, Copy, RefreshCw } from 'lucide-react'

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

import { useModal } from '@/hooks/use-modal-store'
import { useOrigin } from '@/hooks/use-origin'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const InviteModal = () => {
	const {
		onOpen,
		onClose,
		type,
		isOpen,
		data: { server: { inviteCode, id } = {} },
	} = useModal()
	const origin = useOrigin()
	const [copied, setCopied] = useState(false)
	const [isLoading, setIsLoading] = useState(false)

	const isModalOpen = isOpen && type === 'INVITE'

	const inviteUrl = `${origin}/invite/${inviteCode}`

	const onCopy = () => {
		navigator.clipboard.writeText(inviteUrl)
		setCopied(true)

		setTimeout(() => {
			setCopied(false)
		}, 1000)
	}

	const onGenerateNewLinkClick = async () => {
		try {
			setIsLoading(true)

			const response = await axios.patch(`/api/servers/${id}/invite-code`)

			onOpen('INVITE', { server: response.data })
		} catch (err) {
			console.log(err)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Invite Friends
					</DialogTitle>
				</DialogHeader>
				<div className="p-6">
					<Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
						Server invite link
					</Label>
					<div className="flex items-center mt-2 gap-x-2">
						<Input
							disabled={isLoading}
							className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
							value={inviteUrl}
							readOnly
						/>
						<Button disabled={isLoading} size="icon" onClick={onCopy}>
							{copied ? (
								<Check className="w-4 h-4" />
							) : (
								<Copy className="w-4 h-4" />
							)}
						</Button>
					</div>
					<Button
						disabled={isLoading}
						variant="link"
						size="sm"
						className="text-xs text-zinc-500 mt-4"
						onClick={onGenerateNewLinkClick}
					>
						Generate a new link
						<RefreshCw
							className={cn('w-4 h-4 ml-2', isLoading && 'animate-spin')}
						/>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	)
}

export default InviteModal
