'use server'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { fetchUser } from '@/utils/supabase/authActions'
import { User } from '@supabase/supabase-js'

export const getAndIncrementPageVisits = async (): Promise<any> => {
	'use server'

	try {
		const cookieStore = cookies()
		const supabase = createClient(cookieStore)
		
		// First, try to get the current analytics record
		const { data, error } = await supabase.from('analytics').select('*').eq('id', 1)
		
		if (error) {
			console.error('Error fetching analytics:', error)
			return null
		}

		let newCount: number
		
		// If no record exists, create one with count 1
		if (!data || data.length === 0) {
			const { error: insertError } = await supabase
				.from('analytics')
				.insert({ id: 1, page_visits: 1 })
			
			if (insertError) {
				console.error('Error creating analytics record:', insertError)
				return null
			}
			newCount = 1
		} else {
			// Increment the existing count
			newCount = data[0].page_visits + 1
			
			// Update the record
			const { error: updateError } = await supabase
				.from('analytics')
				.update({ page_visits: newCount })
				.eq('id', 1)
			
			if (updateError) {
				console.error('Error updating analytics:', updateError)
				return null
			}
		}

		return newCount
	} catch (error) {
		console.error('Unexpected error in getAndIncrementPageVisits:', error)
		return null
	}
}
