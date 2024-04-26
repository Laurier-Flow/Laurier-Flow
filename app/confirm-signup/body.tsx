import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { redirect, useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { handleVerifyEmail } from "./ConfirmAuthAction";

export default function Body() {
    const searchParams = useSearchParams()
    const token_hash = searchParams.get('token_hash')

    if (!token_hash) {
        redirect('/')
    }

    const handleVerifyClick = () => {
        handleVerifyEmail(token_hash)
        redirect('/')
    }

    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-6'>
                <h1 className="text-3xl md:text-4xl font-bold text-background dark:text-foreground">
                    Verify Laurier Student Status
                </h1>
                <h2 className="text-lg md:text-2xl font-light text-background dark:text-foreground">
                    We need to confirm you're a Laurier student, click verify to complete the registration process.
                </h2>
                <button onClick={handleVerifyClick} type="button" className="animate-bounce flex flex-row items-center justify-center gap-2 w-full mt-8 py-4 px-6 text-lg font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white transition-all duration-1000 ease-in-out">
                    <ShieldCheck />
                    <h1>Verify</h1>
                </button>
            </div>
        </BackgroundGradientAnimation>
    )

}