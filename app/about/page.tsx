import TeamMember from "@/components/TeamMember"

export default function About(){
    return (
        <div>
            <h1 className="text-3xl text-center font-bold underline">About WLU Flow</h1>
            <h2>Welcome to WLU Flow!</h2>
            <p>Flow is a course planning website for Wlifried Laurier University students. You can find everything from courses and professors to prerequisites here. Our mission is simple: to empower Laurier students through uncensored and unfiltered course and professor reviews. Had a bad prof? We want to know. Had a great one? Tell us as well. Found a course completely and utterly useless? Leave a review. Your experiences help us help 100s of students like you every month choose great courses and avoid not so great ones.</p>
            <h2>Our History</h2>
            <h2>Meet The Team</h2>
                <TeamMember />
                <TeamMember />
                <TeamMember />
        </div>
    )
}
