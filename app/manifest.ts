import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest { 
    return {
        name: 'Laurier Flow',
        short_name: 'Laurier Flow',
        description: 'Explore courses and professors at Laurier',
        start_url: '/',
        display: 'browser',
        orientation: 'any',
        categories: ['education', 'university', 'courses', 'professors', 'Wilfrid Laurier University', 'students'],
        related_applications: [],
        prefer_related_applications: false,
    }


}