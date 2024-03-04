export default function Page({params} : {params: {code: string}}) {
    let courseCode = params.code
    courseCode = courseCode.slice(0, 2) + " " + courseCode.slice(2);

    return (
        <div>
            <h1>{courseCode}</h1>
        </div>
    )
}