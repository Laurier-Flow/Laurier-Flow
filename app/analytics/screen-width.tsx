import { useState, useEffect } from 'react'

const useScreenWidth = () => {
	const [screenWidth, setScreenWidth] = useState(() => {
		if (typeof window !== 'undefined') {
			return window.screen.width
		}
		return 0
	})

	useEffect(() => {
		const handleResize = () => {
			setScreenWidth(window.screen.width)
		}

		// Listen for resize events
		window.addEventListener('resize', handleResize)

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return screenWidth
}

export default useScreenWidth
