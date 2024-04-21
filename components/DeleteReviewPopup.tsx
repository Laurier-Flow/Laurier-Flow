import { handleCourseReviewDelete } from "@/app/profile/DeleteReviewAction";
import { useRef } from "react";

export default function DeleteReviewPopup({onClose, reviewId}: {onClose: () => void, reviewId: string}) {
    const popupRef = useRef<HTMLDivElement | null>(null);

    const deleteReview = async (reviewId: string) => {
        handleCourseReviewDelete(reviewId)
        onClose()
        location.reload()
    }

    return (
        <div ref={popupRef} className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-background border-red-800 border-2 rounded-md p-8 max-w-md w-full">
            <form
                className="flex flex-col gap-4 text-foreground bg-background"
                action={() => deleteReview(reviewId)}
            >
                <label className="text-3xl font-bold text-foreground">Delete for all eternity?</label>
                <label className="text-md font-base mb-5 text-foreground">This cannot be undone</label>

                <hr className="mb-6 border-gray-300 dark:border-gray-800"></hr>

                <div>
                    <button type="submit" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-red-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none dark:bg-red-800 dark:text-foreground">
                        Delete
                    </button>
                    <button onClick={onClose} type="button" className="ml-4 py-3 px-4 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-gray-800 text-white hover:bg-gray-900 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-700 dark:text-foreground">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    )
}