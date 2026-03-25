import Footer from '@/components/Footer'
import Header from '@/components/Header'
import TeamMember from '@/components/TeamMember'
import { fetchUser } from '@/utils/supabase/authActions'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'About',
	description: 'Learn more about Laurier Flow and the team behind it.'
}

export default async function About() {
	const user = await fetchUser()
	await getAndIncrementPageVisits()

	return (
		<div className='cp-root'>
			<div className='cp-bg-layer'>
				<div className='cp-orb cp-orb-1' />
				<div className='cp-orb cp-orb-2' />
				<div className='cp-noise' />
			</div>

			<Header user={user} />

			<div className='ab-content'>
				<div className='ab-hero'>
					<p className='ab-eyebrow'>About</p>
					<h1 className='ab-headline'>
						Built by Laurier students,<br />
						for Laurier students
					</h1>
					<p className='ab-hero-desc'>
						Flow is a course planning platform for Wilfrid Laurier University.
						Find courses, read reviews, discover professors, and plan your
						degree &mdash; all powered by real student experiences.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='ab-section'>
					<h2 className='ab-section-label'>Our Mission</h2>
					<div className='ab-mission'>
						<p>
							Our mission is simple: to empower Laurier students through
							uncensored and unfiltered course and professor reviews.
						</p>
						<p>
							Had a bad prof? We want to know. Had a great one? Tell us as well.
							Found a course completely and utterly useless? Leave a review. Your
							experiences help more than 20,000 students like you every month
							choose great courses and avoid not so great ones.
						</p>
					</div>
				</div>

				<hr className='cp-divider' />

				<div className='ab-section'>
					<h2 className='ab-section-label'>Meet the Founders</h2>
					<div className='ab-team-grid'>
						<TeamMember
							name='Faizaan Qureshi'
							role='Lead Software Engineer &mdash; Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/faizaan.jpeg'
							linkedinUrl='https://www.linkedin.com/in/faizaan-qureshi/'
							igUrl='https://www.instagram.com/faizaanqureshi_'
							githubUrl='https://github.com/faizaanqureshi'
							desc='Known for his visionary approach, Faizaan has not only architected the robust backend infrastructure but also played a key role in developing significant frontend components, including the entire Explore page, Courses, and Professors pages. He crafted the homepage, styled key authentication modals, and engineered database functions and triggers. He also acted as the project manager. He adeptly handles daily standups and efficiently manages tasks using Jira. Outside of his technical and managerial roles, Faizaan enjoys coding, traveling, basketball, and maintaining a fit lifestyle, constantly pushing the boundaries of innovation and team leadership.'
						/>
						<TeamMember
							name='Muhammad Mujtaba'
							role='Co-Lead Software Engineer &mdash; Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/mhmd.jpeg'
							linkedinUrl='https://www.linkedin.com/in/mhmmd-m/'
							igUrl='https://www.instagram.com/_.mh.mm.d._'
							githubUrl='https://github.com/mhmmd-03'
							desc='Specializing in critical functionalities, Muhammad has adeptly developed the search bar, navigations, and elements of the homepage design, showcasing his ability to enhance user interaction and site efficiency. His expertise also extends into cloud computing, where he excels in deploying scalable and robust cloud solutions. An avid sports enthusiast, Muhammad passionately supports local teams like the Toronto Raptors and the Maple Leafs, reflecting his team-oriented mindset and community spirit.'
						/>
						<TeamMember
							name='Abdullah Shahid'
							role='Software Engineer &mdash; Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/abdullah.jpg'
							linkedinUrl='https://www.linkedin.com/in/abdullahshahid247/'
							igUrl='https://www.instagram.com/abdshd.247'
							githubUrl='https://github.com/abdshd'
							desc='Abdullah focused primarily on developing the authentication system and flows along with other essential components of the project. On top of this, he also designed the UI and theme for several pages and components, ensuring a clean user experience. Abdullah is working at Lyft, and is pursuing a career in iOS and ML engineering. Alongside his academics and career pursuits, he is passionate about maintaining his fitness by regularly doing weightlifting and calisthenics, while practicing jiu-jitsu and wrestling.'
						/>
						<TeamMember
							name='Soham Nagi'
							role='Front End Software Engineer &mdash; Computer Science @ University of Waterloo'
							imageUrl='./teampics/soham.JPG'
							linkedinUrl='https://www.linkedin.com/in/sohamnagi/'
							igUrl='https://www.instagram.com/soham.nagi'
							githubUrl='https://github.com/SohamNagi'
							desc="Soham's role has been pivotal in enhancing the user experience, having developed key features such as feedback components, the About page, and the Privacy Policy. Soham's keen eye for detail doesn't stop at development; he is also deeply involved in thorough testing and UI/UX feedback and planning, ensuring that every user interaction is both intuitive and pleasing. Outside of his professional life, he is an enthusiastic soccer player and an ardent fan of Real Madrid, channeling the same passion and precision he has for frontend engineering into every game he plays or watches."
						/>
						<TeamMember
							name='Shahrukh Qureshi'
							role='Software Engineer &mdash; Computer Science (UW) + Business Administration (BBA)'
							imageUrl='./teampics/srk.jpeg'
							linkedinUrl='https://www.linkedin.com/in/qureshishahrukh/'
							igUrl='https://www.instagram.com/shahruk._h'
							githubUrl='https://github.com/ShaleeQureshi'
							desc='Shahrukh played a crucial role in the ideation, development, and marketing of the platform. He ensured the core processes were seamless and is actively enhancing the platform with course schedule integration, GPA calculation features, and many others with the aim to simplify the Laurier student experience. Known for his exceptional work ethic, Shahrukh stands out as one of the hardest-working individuals in any setting. A passionate basketball fan, he brings the same dedication and focus to the court as he does to his professional and academic endeavors. His commitment to excellence is a hallmark of both his career and personal life, making him a standout member of our team.'
						/>
					</div>
				</div>
			</div>

			<Footer />
		</div>
	)
}
