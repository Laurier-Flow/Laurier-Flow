function AddReview({
    courseName
}: {
    courseName: string
}) {

    return (
        <div className="flex flex-col p-4">
            <h1 className="pb-4 text-xl">What do you think of {courseName}?</h1>
            <button type="button" className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-primary text-white hover:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600">
                Add your review
            </button>
        </div>
    );
}

// TEST

export default AddReview;