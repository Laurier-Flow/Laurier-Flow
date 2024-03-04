export default function Page({params} : {params: {code: string}}) {
    return (
        <div>
            <h1>{params.code}</h1>
        </div>
    )
}