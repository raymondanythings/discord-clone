'use client'
import axios from 'axios'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

import { useModal } from '@/hooks/use-modal-store'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'

const DeleteServerModal = () => {
	const {
		onClose,
		type,
		isOpen,
		data: { server: { name, id } = {} },
	} = useModal()

	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	const isModalOpen = isOpen && type === 'DELETE_SERVER'

	const onClick = useCallback(async () => {
		try {
			setIsLoading(true)
			await axios.delete(`/api/servers/${id}`)
			onClose()
			router.refresh()
			router.push('/')
		} catch (error) {
			console.log('[LEAVER_SERVER_ERROR]', error)
		} finally {
			setIsLoading(false)
		}
	}, [id, onClose, router])

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black p-0 overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Delete Server
					</DialogTitle>
					<DialogDescription className="text-center text-zinc-500">
						Are you sure you want to this?{' '}
						<span className="font-semibold text-indigo-500">{name}</span> will
						be permanently deleted.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="bg-gray-100 px-6 py-4">
					<div className="flex items-center justify-between w-full">
						<Button variant="ghost" disabled={isLoading} onClick={onClose}>
							Cancel
						</Button>
						<Button variant="primary" disabled={isLoading} onClick={onClick}>
							Confirm
						</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default DeleteServerModal
