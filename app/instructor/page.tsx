import Loading from "@/components/Loading";
import { Suspense } from "react";
import InstructorInfo from "./InstructorInfo";

function InstructorPage() {
    return (
        <div className="flex flex-col justify-evenly w-full bg-slate-50 dark:bg-slate-950 lg:max-w-6xl lg:border-x-2 dark:lg:border-slate-900 lg:pl-6 lg:pr-6">
            <Suspense fallback={<Loading />}>
                <InstructorInfo />
            </Suspense>
        </div>
    )
}

export default InstructorPage;