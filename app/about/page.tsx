import TeamMember from "@/components/TeamMember";

export default function About() {
  return (
    <div className="flex flex-col justify-evenly w-full bg-slate-50 dark:bg-slate-950 lg:max-w-6xl lg:border-x-2 dark:lg:border-slate-900 lg:pl-6 lg:pr-6">
      <h1 className="text-3xl py-3 text-center font-bold">About WLU Flow</h1>
      <hr className="border-gray-300 dark:border-gray-800"></hr>
      <h2 className="text-xl py-2 font-semibold">Welcome to WLU Flow!</h2>
      <p className="pb-2">
        Flow is a course planning website for University of Waterloo students.
        You can find everything from courses and professors to prerequisites
        here.
      </p>
      <p className="pb-2">
        Our mission is simple: to empower UWaterloo students through uncensored
        and unfiltered course and professor reviews.
      </p>
      <p className="pb-2">
        Had a bad prof? We want to know. Had a great one? Tell us as well. Found
        a course completely and utterly useless? Leave a review. Your
        experiences help us help more than 30,000 students like you every month
        choose great courses and avoid not so great ones.
      </p>
      <h2 className="text-xl py-2 font-semibold">Our History</h2>
      <p className="pb-2">
        The most handsome brown boys from the double degree decided to
        collaborate and bless the WLU community - "Soham Nagi"
      </p>
      <h2 className="text-xl py-2 font-semibold">Meet The Team</h2>
      <div>
        <TeamMember
          name="Faizaan Qureshi"
          role="Heiseinberg"
          imageUrl="https://media.licdn.com/dms/image/D5603AQFyfypgQBmhfg/profile-displayphoto-shrink_200_200/0/1693374520689?e=1714003200&v=beta&t=oDNIja1nwBRq1JhSfzwKEVflwcz8kqHzf1MnGxA_qU0"
          linkedinUrl="https://www.linkedin.com/in/faizaan-qureshi/"
        />
        <TeamMember
          name="Muhammad Mujtaba"
          role="Software"
          imageUrl="https://media.licdn.com/dms/image/D5603AQHe4-dd8dHOuA/profile-displayphoto-shrink_200_200/0/1679012694874?e=1714003200&v=beta&t=O94YxSvNJEFybvZAZq-r5i0lqPRD1XViR5FCSvmDqhw"
          linkedinUrl="https://www.linkedin.com/in/mhmmd-m/"
        />
        <TeamMember
          name="Abdullah Shahid"
          role="Software"
          imageUrl="/teampics/D95268AF-DD70-4D92-9F88-DC436949BBB6.jpg"
          linkedinUrl="https://www.linkedin.com/in/abdullahshahid247/"
        />
        <TeamMember
          name="Soham Nagi"
          role="Software"
          imageUrl="https://media.licdn.com/dms/image/D5603AQGm58eD6354Mg/profile-displayphoto-shrink_200_200/0/1680819421625?e=1714003200&v=beta&t=odnVt9GuGnqWjzsGd5N8bEk7QbL8sTOtTVXI9HFuWrY"
          linkedinUrl="https://www.linkedin.com/in/sohamnagi/"
        />
        <TeamMember
          name="Shahrukh Qureshi"
          role="Software"
          imageUrl="https://media.licdn.com/dms/image/D5603AQG3D_-qrcORWQ/profile-displayphoto-shrink_200_200/0/1679183158797?e=1714003200&v=beta&t=LW9hoEV5KC24p5hR4-SV04vaG3f7ZU5ny7dywg6VN8c"
          linkedinUrl="https://www.linkedin.com/in/qureshishahrukh/"
        />
      </div>
    </div>
  );
}
