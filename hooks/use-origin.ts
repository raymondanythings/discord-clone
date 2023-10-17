import { useEffect, useState } from 'react'

export const useOrigin = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return !mounted || typeof window !== 'undefined'
		? window.location.origin ?? ''
		: ''
}
