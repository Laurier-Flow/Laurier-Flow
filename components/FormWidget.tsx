'use client'
import React from 'react'
import { useTheme } from 'next-themes'
import { Sidetab } from '@typeform/embed-react'

const FormWidget = () => {
	const { resolvedTheme } = useTheme()

	return (
		<Sidetab
			id='m7tAtBpx'
			buttonText='Feedback'
			buttonHeight='125'
			buttonTextSize='12'
			buttonWidth='25'
			buttonColor={resolvedTheme === 'dark' ? '#b07030' : '#7C3AED'}
		/>
	)
}

export default FormWidget
