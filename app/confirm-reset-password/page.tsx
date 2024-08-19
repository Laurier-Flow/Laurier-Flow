import { Metadata } from 'next'
import ConfirmPasswordReset from './ConfirmPasswordResetComponent'

export const metadata: Metadata = {
	title: 'Confirm Password Reset',
	description: 'Confirm your password reset to Laurier Flow.'
}

export default function ConfirmSignupPage() {
	return <ConfirmPasswordReset />
}
