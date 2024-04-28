import Header from "@/components/Header";
import TeamMember from "@/components/TeamMember";
import { fetchUser } from "@/utils/supabase/authActions";
import { PopupButton } from "@typeform/embed-react";

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
          <h2 className="text-xl pt-8 font-semibold">Meet Our Founders</h2>
          <div>
            <TeamMember
              name="Faizaan Qureshi"
              role="Lead Software Engineer - Computer Science (UW) + Business Administration (BBA)"
              imageUrl="./teampics/faizaan.jpeg"
              linkedinUrl="https://www.linkedin.com/in/faizaan-qureshi/"
              igUrl="https://www.instagram.com/faizaanqureshi_"
              githubUrl="https://github.com/faizaanqureshi"
              desc="xxxxx"
            />
            <TeamMember
              name="Muhammad Mujtaba"
              role="Software Engineer - Computer Science (UW) + Business Administration (BBA)"
              imageUrl="./teampics/mhmd.jpeg"
              linkedinUrl="https://www.linkedin.com/in/mhmmd-m/"
              igUrl="https://www.instagram.com/_.mh.mm.d._"
              githubUrl="https://github.com/mhmmd-03"
              desc="xxxxx"
            />
            <TeamMember
              name="Abdullah Shahid"
              role="Software Engineer - Computer Science (UW) + Business Administration (BBA)"
              imageUrl="./teampics/abdullah.jpg"
              linkedinUrl="https://www.linkedin.com/in/abdullahshahid247/"
              igUrl="https://www.instagram.com/abdshd.247"
              githubUrl="https://github.com/abdshd"
              desc="xxxxx"
            />
            <TeamMember
              name="Soham Nagi"
              role="Front End Software Engineer — Computer Science @ University of Waterloo"
              imageUrl="./teampics/soham.JPG"
              linkedinUrl="https://www.linkedin.com/in/sohamnagi/"
              igUrl="https://www.instagram.com/soham.nagi"
              githubUrl="https://github.com/SohamNagi"
              desc="xxxxx"
            />
            <TeamMember
              name="Shahrukh Qureshi"
              role="Software Engineer - Computer Science (UW) + Business Administration (BBA)"
              imageUrl="./teampics/srk.jpeg"
              linkedinUrl="https://www.linkedin.com/in/qureshishahrukh/"
              igUrl="https://www.instagram.com/shahruk._h"
              githubUrl="https://github.com/ShaleeQureshi"
              desc="xxxxx"
            />
          </div>
        </div>
      </div>
    </>
  );
}
