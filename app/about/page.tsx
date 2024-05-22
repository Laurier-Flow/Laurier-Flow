import Footer from '@/components/Footer'
import Header from '@/components/Header'
import TeamMember from '@/components/TeamMember'
import { fetchUser } from '@/utils/supabase/authActions'
import { PopupButton } from '@typeform/embed-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'About',
	description: 'Learn more about Laurier Flow and the team behind it.'
}

export default async function About() {
	const user = await fetchUser()

	return (
		<>
			<Header user={user} />
			<div className="flex min-w-full flex-col bg-[url('/banner-sm-light.jpg')] p-4 dark:bg-[url('/banner-sm.jpg')] md:flex-row md:justify-center md:bg-[url('/banner-md-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] lg:bg-[url('/banner-light.jpg')] lg:dark:bg-[url('/banner.jpg')]">
				<div className='w-f flex max-w-6xl flex-1 flex-row justify-between pt-20'>
					<div className='flex flex-1 flex-col justify-end pl-4'>
						<h1 className='mb-2 text-2xl font-bold text-white md:text-5xl'>
							About
						</h1>
					</div>
				</div>
			</div>

			<div className='card'>
				<div className='p-4'>
					<h2 className='py-4 text-xl font-semibold'>
						Welcome to Laurier Flow!
					</h2>
					<p className='pb-2'>
						Flow is a course planning website for Wilfrid Laurier University
						students. You can find everything from courses and professors to
						prerequisites here.
					</p>
					<p className='pb-2'>
						Our mission is simple: to empower Laurier students through
						uncensored and unfiltered course and professor reviews.
					</p>
					<p className='pb-2'>
						Had a bad prof? We want to know. Had a great one? Tell us as well.
						Found a course completely and utterly useless? Leave a review. Your
						experiences help us help more than 20,000 students like you every
						month choose great courses and avoid not so great ones.
					</p>
					<h2 className='pt-8 text-xl font-semibold'>Meet Our Founders</h2>
					<div className='pt-4'>
						<TeamMember
							name='Faizaan Qureshi'
							role='Lead Software Engineer - Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/faizaan.jpeg'
							linkedinUrl='https://www.linkedin.com/in/faizaan-qureshi/'
							igUrl='https://www.instagram.com/faizaanqureshi_'
							githubUrl='https://github.com/faizaanqureshi'
							desc='Known for his visionary approach, Faizaan has not only architected the robust backend infrastructure but also played a key role in developing significant frontend components, including the entire Explore page, Courses, and Professors pages. He crafted the homepage, styled key authentication modals, and engineered database functions and triggers. He also acted as the project’s product manager. He adeptly handles daily standups and efficiently manages tasks using Jira. Outside of his technical and managerial roles, Faizaan enjoys coding, traveling, basketball, and maintaining a fit lifestyle, constantly pushing the boundaries of innovation and team leadership.'
						/>
						<TeamMember
							name='Muhammad Mujtaba'
							role='Software Engineer - Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/mhmd.jpeg'
							linkedinUrl='https://www.linkedin.com/in/mhmmd-m/'
							igUrl='https://www.instagram.com/_.mh.mm.d._'
							githubUrl='https://github.com/mhmmd-03'
							desc='Specializing in critical functionalities, Muhammad has adeptly developed the search bar, navigations, and elements of the homepage design, showcasing his ability to enhance user interaction and site efficiency. His expertise also extends into cloud computing, where he excels in deploying scalable and robust cloud solutions. An avid sports enthusiast, Muhammad passionately supports local teams like the Toronto Raptors and the Maple Leafs, reflecting his team-oriented mindset and community spirit.'
						/>
						<TeamMember
							name='Abdullah Shahid'
							role='Software Engineer - Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/abdullah.jpg'
							linkedinUrl='https://www.linkedin.com/in/abdullahshahid247/'
							igUrl='https://www.instagram.com/abdshd.247'
							githubUrl='https://github.com/abdshd'
							desc='Abdullah has focused his expertise primarily on developing robust authentication flows and other essential components of the project. His technical prowess ensures secure and efficient user experiences. Alongside his academic and professional pursuits, Abdullah is passionate about maintaining his fitness, regularly hitting the gym, and engaging in martial arts such as jiu jitsu and wrestling.'
						/>
						<TeamMember
							name='Soham Nagi'
							role='Front End Software Engineer — Computer Science @ University of Waterloo'
							imageUrl='./teampics/soham.JPG'
							linkedinUrl='https://www.linkedin.com/in/sohamnagi/'
							igUrl='https://www.instagram.com/soham.nagi'
							githubUrl='https://github.com/SohamNagi'
							desc="Soham's role has been pivotal in enhancing the user experience, having developed key features such as feedback components, the About page, and the Privacy Policy. Soham's keen eye for detail doesn't stop at development; he is also deeply involved in thorough testing and UI/UX feedback and planning, ensuring that every user interaction is both intuitive and pleasing. Known for his charm, Soham is recognized as one of the handsomest brown boys around. Outside of his professional life, he is an enthusiastic soccer player and an ardent fan of Real Madrid, channeling the same passion and precision he has for frontend engineering into every game he plays or watches."
						/>
						<TeamMember
							name='Shahrukh Qureshi'
							role='Software Engineer - Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/srk.jpeg'
							linkedinUrl='https://www.linkedin.com/in/qureshishahrukh/'
							igUrl='https://www.instagram.com/shahruk._h'
							githubUrl='https://github.com/ShaleeQureshi'
							desc='Shahrukh played a crucial role in developing and refining user profile management and is actively enhancing the platform by integrating course scheduling and GPA calculation features along with other modifications throughout the platform. Known for his exceptional work ethic, Shahrukh has established himself as one of the hardest-working individuals in any setting. A passionate basketball fan, he brings the same dedication and focus to the court as he does to his professional and academic endeavors. His commitment to excellence is a hallmark of both his career and personal life, making him a standout member of our team.'
						/>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}
