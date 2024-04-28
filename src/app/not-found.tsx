import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"

export default function NotFound() {
    return (
        <BackgroundGradientAnimation gradientBackgroundStart='var(--gradient-start)' gradientBackgroundEnd='var(--gradient-end)' firstColor='var(--bubble)' secondColor='var(--bubble)' thirdColor='var(--bubble)' fourthColor='var(--bubble)' fifthColor='var(--bubble)' pointerColor='var(--bubble)'>
            <div className='flex flex-col justify-center items-center absolute inset-0 z-[100] p-6 max-w-6xl w-full mx-auto gap-12'>
                <h1 className="text-background dark:text-foreground text-4xl md:text-6xl font-bold">Feeling lost?</h1>
                <h2 className="text-background dark:text-foreground text-lg md:text-xl font-semibold">The page you're trying to reach doesn't exist</h2>
                <a href="/">
                    <h2 className="text-background dark:text-foreground text-xl font-semibold underline underline-offset-4">Return Home</h2>
                </a>
                <h3 className="mt-8 text-slate-300 dark:text-foreground text-md font-semibold">404 - Not Found</h3>
            </div>
        </BackgroundGradientAnimation>
    )
}