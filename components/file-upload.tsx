'use client'
import '@uploadthing/react/styles.css'

import Image from 'next/image'
import { X } from 'lucide-react'
import { UploadDropzone } from '@/lib/uploadthing'
import { OurFileRouter } from '@/app/api/uploadthing/core'

interface FileUploadProps {
	onChange: (url?: string) => void
	value: string
	endpoint: keyof OurFileRouter
}

export const FileUpload = ({ endpoint, onChange, value }: FileUploadProps) => {
	const fileType = value?.split('.').pop()
	if (value && fileType !== 'pdf') {
		return (
			<div className="relative h-20 w-20">
				<Image fill src={value} alt="Upload" className="rounded-full" />
				<button
					onClick={() => onChange('')}
					className="bg-rose-500 text-white p1 rounded-full absolute top-0 right-0 shadow-sm"
					type="button"
				>
					<X className="w-4 h-4" />
				</button>
			</div>
		)
	}
	return (
		<UploadDropzone
			endpoint={endpoint}
			onClientUploadComplete={(res) => {
				onChange(res?.[0].url)
			}}
			onUploadError={(error: Error) => {
				console.log(error)
			}}
		/>
	)
}
