'use client'

import Spinner from "@/components/Spinner"
import { Suspense } from "react"
import Body from "./body"

export default function ChangePassword() {
    return (
        <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <Body />
        </Suspense>
    )
}