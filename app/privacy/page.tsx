import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { fetchUser } from '@/utils/supabase/authActions'
import { getAndIncrementPageVisits } from '@/utils/supabase/pageVisits'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Privacy Policy',
	description: 'The Laurier Flow Privacy Policy'
}

export default async function Privacy() {
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

			<div className='pv-content'>
				<div className='pv-hero'>
					<p className='ab-eyebrow'>Legal</p>
					<h1 className='ab-headline'>Privacy Policy</h1>
					<p className='ab-hero-desc'>
						Your privacy matters. Here is how we collect, use, and protect your
						information when you use Laurier Flow.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Log Files</h2>
					<p className='pv-text'>
						Laurier Flow follows a standard procedure of using log files. These
						files log visitors when they visit websites. All hosting companies
						do this as a part of hosting services&apos; analytics. The information
						collected by log files includes:
					</p>
					<div className='pv-grid'>
						<ul className='pv-list'>
							<li>Internet protocol (IP) addresses</li>
							<li>Browser type</li>
						</ul>
						<ul className='pv-list'>
							<li>Internet Service Provider (ISP)</li>
							<li>Referring / exit pages</li>
						</ul>
						<ul className='pv-list'>
							<li>Number of clicks</li>
							<li>Date and time stamp</li>
						</ul>
					</div>
					<p className='pv-text'>
						This information is not linked to any personally identifiable
						information. The purpose of the information is for analyzing trends,
						administering the site, tracking users&apos; movement on the website,
						and gathering demographic information.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Cookies &amp; Web Beacons</h2>
					<p className='pv-text'>
						Like any other website, Laurier Flow uses cookies. These cookies are
						used to store information including visitors&apos; preferences, and the
						pages on the website that the visitor accessed or visited. The data
						are used to optimize the users&apos; experience by customizing our web
						page content based on visitors&apos; browser type and/or other
						information.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Third Party Services</h2>
					<p className='pv-text'>
						We leverage a variety of open-source technologies and external
						libraries that process, but do not store, your data.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Third Party Privacy Policies</h2>
					<p className='pv-text'>
						Laurier Flow&apos;s Privacy Policy does not apply to other software used
						by the site. We advise you to consult the respective privacy
						policies of these third parties for more detailed information.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Information Regarding Children</h2>
					<p className='pv-text'>
						Laurier Flow does not knowingly collect any Personal Identifiable
						Information from children under the age of 13. If you believe your
						child has provided such information on our website, we strongly
						encourage you to contact us immediately at{' '}
						<a href='mailto:qfaizaan@gmail.com' className='pv-link'>
							qfaizaan@gmail.com
						</a>
						. We will do our best efforts to promptly remove such information
						from our records.
					</p>
				</div>

				<hr className='cp-divider' />

				<div className='pv-section'>
					<h2 className='pv-section-title'>Consent</h2>
					<p className='pv-text'>
						By using our website, you hereby consent to our Privacy Policy and
						agree to its Terms and Conditions.
					</p>
				</div>
			</div>

			<Footer />
		</div>
	)
}
