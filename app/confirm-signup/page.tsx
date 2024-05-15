import { Metadata } from 'next'
import ConfirmSignup from './ConfirmSignUpComponent'

export const metadata: Metadata = {
	title: 'Confirm Signup',
	description: 'Confirm your signup to Laurier Flow.'
}

export default function ConfirmSignupPage() {
	return <ConfirmSignup />
}
