export default function Privacy() {
  return (
    <div className="card">
      <h1 className="text-3xl py-3 text-center font-bold">Privacy Policy</h1>
      <hr className=" border-gray-300 dark:border-gray-800"></hr>
      <h2 className="text-xl py-2 font-semibold">Log Files</h2>
      <p>
        WLU Flow follows a standard procedure of using log files. These files
        log visitors when they visit websites. All hosting companies do this as
        a part of hosting services' analytics. The information collected by log
        files includes:
      </p>
      <div className="grid py-4 grid-cols-3 mx-auto w-full max-w-4xl">
        <ul className="list-disc list-outside text-left">
          <li className="mb-2">Internet protocol (IP) addresses</li>
          <li className="mb-2">Browser type</li>
        </ul>
        <ul className="list-disc list-outside text-left">
          <li className="mb-2">Internet Service Provider (ISP)</li>
          <li className="mb-2">Referring/exit pages</li>
        </ul>
        <ul className="list-disc list-outside text-left">
          <li className="mb-2">Number of clicks</li>
          <li className="mb-2">Date and time stamp</li>
        </ul>
      </div>
      <p>
        Please note that this information is not linked to any personally
        identifiable information. The purpose of the information is for
        analyzing trends, administering the site, tracking users' movement on
        the website, and gathering demographic information.
      </p>
      <h2 className="text-xl py-2 font-semibold">Cookies and Web Beacons</h2>
      <p>
        Like any other website, WLU Flow uses 'cookies'. These cookies are used
        to store information including visitors' preferences, and the pages on
        the website that the visitor accessed or visited. The data are used to
        optimize the users' experience by customizing our web page content based
        on visitors' browser type and/or other information.
      </p>
      <h2 className="text-xl py-2 font-semibold">Third Party Services</h2>
      <p>
        We leverage a variety of open-source technologies and external libraries
        that process, but do not store, your data. We also employ third-party
        authentication plugins and software from Google and Facebook.
      </p>
      <h2 className="text-xl py-2 font-semibold">
        Third Party Privacy Policies
      </h2>
      <p>
        WLU Flow's Privacy Policy does not apply to other software used by the
        site. Therefore, we advise you to consult the respective privacy
        policies of these third parties for more detailed information.
      </p>
      <h2 className="text-xl py-2 font-semibold">
        Information Regarding Children
      </h2>
      <p>
        WLU Flow does not knowingly collect any Personal Identifiable
        Information from children under the age of 13. If you believe your child
        has provided such information on our website, we strongly encourage you
        to contact us immediately at{" "}
        <a href="mailto:info@wluflow.com">info@wluflow.com</a>. We will do our
        best efforts to promptly remove such information from our records.
      </p>
      <h2 className="text-xl py-2 font-semibold">Consent</h2>
      <p className="pb-5">
        By using our website, you hereby consent to our Privacy Policy and agree
        to its Terms and Conditions.
      </p>
    </div>
  );
}
