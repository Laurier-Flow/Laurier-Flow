import TeamMember from "@/components/TeamMember"

export default function About(){
    return (
        <div className="w-8/12 bg-center" >
            <h1 className="text-3xl py-5 text-center font-bold underline">About WLU Flow</h1>
            <h2 className="text-xl py-2 font-semibold">Welcome to WLU Flow!</h2>
                <p className="pb-2">Flow is a course planning website for University of Waterloo students. You can find everything from courses and professors to prerequisites here.</p>
                <p className="pb-2">Our mission is simple: to empower UWaterloo students through uncensored and unfiltered course and professor reviews.</p>
                <p className="pb-2">Had a bad prof? We want to know. Had a great one? Tell us as well. Found a course completely and utterly useless? Leave a review. Your experiences help us help more than 30,000 students like you every month choose great courses and avoid not so great ones.</p>
            <h2 className="text-xl py-2 font-semibold">Our History</h2>
            <h2 className="text-xl py-2 font-semibold">Meet The Team</h2>
                <TeamMember />
                <TeamMember />
                <TeamMember />
        </div>
    )
}
