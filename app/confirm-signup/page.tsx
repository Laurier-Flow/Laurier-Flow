'use client'

import Spinner from "@/components/Spinner"
import { Suspense } from "react"
import Body from "./body"
import { Metadata } from "next"

export const metadata : Metadata = {
    title : "Confirm Signup",
    description: "Confirm your signup to Laurier Flow."
}

export default function ConfirmSignup() {
    return (
        <Suspense fallback={<div className="w-full h-full"><Spinner /></div>}>
            <Body />
        </Suspense>
    )
}