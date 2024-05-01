import Header from "@/components/Header";
import TeamMember from "@/components/TeamMember";
import { fetchUser } from "@/utils/supabase/authActions";
import { PopupButton } from "@typeform/embed-react";
import { Metadata } from "next";

export const metadata : Metadata = {
  title : "About",
  description: "Learn more about Laurier Flow and the team behind it.",
  

}


export default async function About() {
  const user = await fetchUser();

  return (
    <>
      <Header user={user} />
      <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
        <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
          <div className="flex flex-1 flex-col justify-end pl-4">
            <h1 className="mb-2 text-2xl font-bold md:text-5xl text-white">
              About
            </h1>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-4">
          <h2 className="text-xl py-4 font-semibold">
            Welcome to Laurier Flow!
          </h2>
          <p className="pb-2">
            Flow is a course planning website for Wilfrid Laurier University
            students. You can find everything from courses and professors to
            prerequisites here.
          </p>
          <p className="pb-2">
            Our mission is simple: to empower Laurier students through
            uncensored and unfiltered course and professor reviews.
          </p>
          <p className="pb-2">
            Had a bad prof? We want to know. Had a great one? Tell us as well.
            Found a course completely and utterly useless? Leave a review. Your
            experiences help us help more than 20,000 students like you every
            month choose great courses and avoid not so great ones.
          </p>
          <h2 className="text-xl pt-8 font-semibold">Our History</h2>
          <p className="pb-2">
            The most handsome brown boys from the double degree decided to
            collaborate and bless the WLU community - "Soham Nagi"
          </p>
          <h2 className="text-xl pt-8 font-semibold">Meet The Team</h2>
          <div>
            <TeamMember
              name="Faizaan Qureshi"
              role="Founder & Lead Software Engineer - Computer Science (UW) + Business Administration (BBA)"
              imageUrl="https://media.licdn.com/dms/image/D5603AQFyfypgQBmhfg/profile-displayphoto-shrink_200_200/0/1693374520689?e=1714003200&v=beta&t=oDNIja1nwBRq1JhSfzwKEVflwcz8kqHzf1MnGxA_qU0"
              linkedinUrl="https://www.linkedin.com/in/faizaan-qureshi/"
              igUrl="https://www.instagram.com/faizaanqureshi_"
              githubUrl="https://github.com/faizaanqureshi"
            />
            <TeamMember
              name="Muhammad Mujtaba"
              role="Founder — Software Engineering 2014"
              imageUrl="https://media.licdn.com/dms/image/D5603AQHe4-dd8dHOuA/profile-displayphoto-shrink_200_200/0/1679012694874?e=1714003200&v=beta&t=O94YxSvNJEFybvZAZq-r5i0lqPRD1XViR5FCSvmDqhw"
              linkedinUrl="https://www.linkedin.com/in/mhmmd-m/"
              igUrl="https://www.instagram.com/_.mh.mm.d._"
              githubUrl="https://github.com/mhmmd-03"
            />
            <TeamMember
              name="Abdullah Shahid"
              role="Founder — Software Engineering 2014"
              imageUrl="https://media.licdn.com/dms/image/D5635AQGyT8kmV6G2sQ/profile-framedphoto-shrink_400_400/0/1676559863827?e=1711051200&v=beta&t=Nj-D38Scomvmd0hBp9KsWEfcrbt0NuqTz4UR0fbBeJk"
              linkedinUrl="https://www.linkedin.com/in/abdullahshahid247/"
              igUrl="https://www.instagram.com/abdshd.247"
              githubUrl="https://github.com/abdshd"
            />
            <TeamMember
              name="Soham Nagi"
              role="Founder — Software Engineering 2014"
              imageUrl="https://media.licdn.com/dms/image/D5603AQGm58eD6354Mg/profile-displayphoto-shrink_200_200/0/1680819421625?e=1714003200&v=beta&t=odnVt9GuGnqWjzsGd5N8bEk7QbL8sTOtTVXI9HFuWrY"
              linkedinUrl="https://www.linkedin.com/in/sohamnagi/"
              igUrl="https://www.instagram.com/soham.nagi"
              githubUrl="https://github.com/SohamNagi"
            />
            <TeamMember
              name="Shahrukh Qureshi"
              role="Founder — Software Engineering 2014"
              imageUrl="https://media.licdn.com/dms/image/D5603AQG3D_-qrcORWQ/profile-displayphoto-shrink_200_200/0/1679183158797?e=1714003200&v=beta&t=LW9hoEV5KC24p5hR4-SV04vaG3f7ZU5ny7dywg6VN8c"
              linkedinUrl="https://www.linkedin.com/in/qureshishahrukh/"
              igUrl="https://www.instagram.com/shahruk._h"
              githubUrl="https://github.com/ShaleeQureshi"
            />
          </div>
        </div>
      </div>
    </>
  );
}
