import Header from "@/components/Header";
import { Suspense } from "react";
import Explore from "./Explore";
import { Spinner } from "@nextui-org/react";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { fetchUser } from "@/utils/supabase/authActions";
import Footer from "@/components/Footer";

export default async function ExplorePage() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const user = await fetchUser()

    return (
        <>
            <Header user={user} />
            <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
                <Explore />
            </Suspense>
            <Footer />
        </>
    );
}