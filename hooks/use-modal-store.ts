import { Server } from '@prisma/client'
import { create } from 'zustand'

export type ModalType =
	| 'CREATE_SERVER'
	| 'INVITE'
	| 'EDIT_SERVER'
	| 'MEMBERS'
	| 'CREATE_CHANNEL'
	| 'LEAVE_SERVER'
	| 'DELETE_SERVER'
interface ModalData {
	server?: Server
}

interface ModalStore {
	type: ModalType | null
	data: ModalData
	isOpen: boolean
	onOpen: (type: ModalType, data?: ModalData) => void
	onClose: () => void
}

export const useModal = create<ModalStore>((set) => ({
	type: null,
	isOpen: false,
	data: {},
	onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
	onClose: () => set({ type: null, isOpen: false }),
}))
