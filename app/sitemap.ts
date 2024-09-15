import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/client'

const staticSites: MetadataRoute.Sitemap = [
	{
		url: 'https://laurierflow.ca/',
		priority: 1,
		changeFrequency: 'monthly'
	},
	{
		url: 'https://laurierflow.ca/about',
		priority: 0.6,
		changeFrequency: 'monthly'
	},
	{
		url: 'https://laurierflow.ca/explore',
		priority: 0.9,
		changeFrequency: 'monthly'
	},
	{
		url: 'https://laurierflow.ca/privacy',
		priority: 0.6,
		changeFrequency: 'monthly'
	}
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const supabase = createClient()
	// Fetch courses from the database
	const { data: courses } = await supabase.from('courses').select('course_code')

	// If there are no courses, return static sites
	if (!courses || courses.length === 0) {
		return staticSites
	}

	// Map course codes to sitemap entries
	const dynamicCourses = courses.map((course) => ({
		url: `https://laurierflow.ca/course/${course.course_code}`,
		priority: 0.8,
		changeFrequency: 'weekly' as const
	}))

	return [...staticSites, ...dynamicCourses]
}
