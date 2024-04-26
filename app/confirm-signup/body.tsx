import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { redirect, useSearchParams } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { handleVerifyEmail } from "./ConfirmAuthAction";
import { useState } from "react";
import { useManageBodyScroll, usePopupManager } from "@/components/Header";
import { useRouter } from "next/navigation";

export default function Body() {
    const searchParams = useSearchParams()
    const token_hash = searchParams.get('token_hash')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
    const router = useRouter()

    useManageBodyScroll(showErrorPopup);

    if (!token_hash) {
        redirect('/')
    }

    const handleVerifyClick = async () => {
        const error = await handleVerifyEmail(token_hash)
        setErrorMessage(error)
        setShowErrorPopup(true)
    }

    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            {showErrorPopup ? (
                <div className="overflow-y-auto max-h-[90vh] border-2 dark:border-gray-600 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background dark:bg-background/80 backdrop-blur rounded-md max-w-md p-8 w-11/12 z-[100]">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-xl font-bold">{errorMessage}</h1>
                        <button onClick={() => router.push('/')} type="button" className="flex flex-row items-center justify-center gap-2 w-full mt-8 py-4 px-6 text-md font-semibold rounded-lg bg-secondary hover:bg-secondary-dark text-black dark:text-white">
                            <h1>Signup again or login</h1>
                        </button>
                    </div>
                </div>
            ) : (
                <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-6'>
                    <h1>{errorMessage}</h1>
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
                </div >
            )
            }
        </BackgroundGradientAnimation >
    )

}