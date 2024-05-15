import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://laurierflow.ca/',
			priority: 1,
			changeFrequency: 'monthly'
		},
		{
			url: 'https://laurierflow.ca/about',
			priority: 0.7,
			changeFrequency: 'monthly'
		},
		{
			url: 'https://laurierflow.ca/explore',
			priority: 0.8,
			changeFrequency: 'monthly'
		},
		{
			url: 'https://laurierflow.ca/privacy',
			priority: 0.7,
			changeFrequency: 'monthly'
		}
	]
}
