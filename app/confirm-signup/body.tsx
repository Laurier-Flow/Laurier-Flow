import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";
import { redirect, useSearchParams } from "next/navigation";

export default function Body() {
    const searchParams = useSearchParams()
    const confirmation_url = searchParams.get('confirmation_url')

    if (!confirmation_url) {
        redirect('/')
    }

    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-12'>
                <h1 className="text-background dark:text-foreground text-4xl md:text-3xl font-bold">Verify Laurier Student Status</h1>
                <h2 className="text-background dark:text-foreground text-4xl md:text-xl font-base">We need to confirm you're a Laurier student, click verify to complete the registration process</h2>
                <a href={confirmation_url}>
                    <button type="button" className="w-4/5 py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-secondary text-white disabled:opacity-50 disabled:pointer-events-none">
                        Verify
                    </button>
                </a>
            </div>
        </BackgroundGradientAnimation>
    )
}