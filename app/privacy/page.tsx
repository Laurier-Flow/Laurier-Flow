import Header from "@/components/Header";
import Spinner from "@/components/Spinner";
import { fetchUser } from "@/utils/supabase/authActions";
import { Suspense } from "react";

export default async function Privacy() {
  const user = await fetchUser();

  return (
    <>
      <Header user={user} />
      <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
        <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
          <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
            <div className="flex flex-1 flex-col justify-end pl-4">
              <h1 className='mb-2 text-2xl font-bold md:text-5xl'>Privacy Policy</h1>
            </div>
          </div>
        </div>


        <div className="card">
          <div className="p-4">
            <h2 className="pt-4 text-xl py-2 font-semibold">Log Files</h2>
            <p>
              WLU Flow follows a standard procedure of using log files. These files
              log visitors when they visit websites. All hosting companies do this as
              a part of hosting services' analytics. The information collected by log
              files includes:
            </p>
            <div className="grid grid-cols-3 mx-auto w-full max-w-4xl">
              <ul className="list-disc list-outside text-left">
                <li className="m-4">Internet protocol (IP) addresses</li>
                <li className="m-4">Browser type</li>
              </ul>
              <ul className="list-disc list-outside text-left">
                <li className="m-4">Internet Service Provider (ISP)</li>
                <li className="m-4">Referring/exit pages</li>
              </ul>
              <ul className="list-disc list-outside text-left">
                <li className="m-4">Number of clicks</li>
                <li className="m-4">Date and time stamp</li>
              </ul>
            </div>
            <p>
              Please note that this information is not linked to any personally
              identifiable information. The purpose of the information is for
              analyzing trends, administering the site, tracking users' movement on
              the website, and gathering demographic information.
            </p>
            <h2 className="pt-8 text-xl py-2 font-semibold">Cookies and Web Beacons</h2>
            <p>
              Like any other website, WLU Flow uses 'cookies'. These cookies are used
              to store information including visitors' preferences, and the pages on
              the website that the visitor accessed or visited. The data are used to
              optimize the users' experience by customizing our web page content based
              on visitors' browser type and/or other information.
            </p>
            <h2 className="pt-8 text-xl py-2 font-semibold">Third Party Services</h2>
            <p>
              We leverage a variety of open-source technologies and external libraries
              that process, but do not store, your data.
            </p>
            <h2 className="pt-8 text-xl py-2 font-semibold">
              Third Party Privacy Policies
            </h2>
            <p>
              WLU Flow's Privacy Policy does not apply to other software used by the
              site. Therefore, we advise you to consult the respective privacy
              policies of these third parties for more detailed information.
            </p>
            <h2 className="pt-8 text-xl py-2 font-semibold">
              Information Regarding Children
            </h2>
            <p>
              WLU Flow does not knowingly collect any Personal Identifiable
              Information from children under the age of 13. If you believe your child
              has provided such information on our website, we strongly encourage you
              to contact us immediately at{" "}
              <a href="mailto:qfaizaan@gmail.com">qfaizaan@gmail.com</a>. We will do our
              best efforts to promptly remove such information from our records.
            </p>
            <h2 className="pt-8 text-xl py-2 font-semibold">Consent</h2>
            <p className="pb-5">
              By using our website, you hereby consent to our Privacy Policy and agree
              to its Terms and Conditions.
            </p>
          </div>
        </div>
      </Suspense>
    </>
  );
}
