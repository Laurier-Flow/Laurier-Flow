'use client'

import HomeFooter from "@/components/HomeFooter"
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation"
import { useSearchParams } from "next/navigation"
import { SendHorizonal } from "lucide-react"
import { Suspense, useEffect, useState } from "react"
import React from "react"
import Spinner from "@/components/Spinner"

type Message = {
    "text": string,
    "messageType": string
}

export default function Chat() {
    return (
        <Suspense fallback={<Spinner />}>
            <ChatContent />
        </Suspense>
    );
}

function ChatContent() {
    const searchParams = useSearchParams()
    const query = searchParams.get('q')
    const [messages, setMessages] = useState<Message[]>(query ? [{ "messageType": "prompt", "text": query }] : [])
    const [loading, setLoading] = useState(query ? true : false)
    const [input, setInput] = useState('');

    useEffect(() => {
        if (query) {
            callAI(query)
        }
    }, [])

    const callAI = (input: string) => {
        fetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ "prompt": input }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => {
                const reader = response.body?.getReader();
                const decoder = new TextDecoder();

                const processStream = async () => {
                    if (reader) {
                        let text = '';
                        let firstRead = true;
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) {
                                setLoading(false);
                                break;
                            }
                            text += decoder.decode(value, { stream: true });
                            const sanitizedText = text
                                .replace(/0:"([^"]*)"/g, '$1') // Remove '0:"' occurrences
                                .replace(/\n/g, '') // Remove newline characters
                                .replace(/"/g, '') // Remove double quotes
                                .replace(/\\n/g, "<br>")

                            if (firstRead) {
                                setMessages(prevMessages => [...prevMessages, { "messageType": "response", "text": sanitizedText.trim() }]);
                                firstRead = false;
                            } else {
                                setMessages(prevMessages => {
                                    const lastMessageIndex = prevMessages.length - 1;
                                    const updatedMessages = [...prevMessages];
                                    updatedMessages[lastMessageIndex] = {
                                        ...updatedMessages[lastMessageIndex],
                                        text: sanitizedText.trim()
                                    }
                                    return updatedMessages;
                                });
                            }
                        }
                    }
                };
                processStream();
            });
    };

    const handleSubmit = () => {
        setLoading(true)
        if (input.trim() !== '') {
            setMessages(prevMessages => [
                ...prevMessages,
                { "messageType": "prompt", "text": input }])
            setLoading(true)
            callAI(input)
            setInput('')
        }
    }

    const handleKeyDown = (event: { key: string; preventDefault: () => void }) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className='flex w-full flex-col'>
            <BackgroundGradientAnimation
                gradientBackgroundStart='var(--gradient-start)'
                gradientBackgroundEnd='var(--gradient-end)'
                firstColor='var(--bubble)'
                secondColor='var(--bubble)'
                thirdColor='var(--bubble)'
                fourthColor='var(--bubble)'
                fifthColor='var(--bubble)'
                pointerColor='var(--bubble)'
            ></BackgroundGradientAnimation>
            <div className='h-screen'>
                <div className='absolute inset-0 z-[100] mx-auto flex w-full max-w-6xl items-center justify-center gap-12 p-6'>
                    <div className="flex flex-col items-center w-full h-full md:w-11/12 bg-slate-900/50 rounded-lg border-2 dark:border-slate-600">
                        <div className='flex-1 w-full p-6 overflow-auto'>
                            <ul className="space-y-5">
                                <li className="max-w-lg flex gap-x-2 sm:gap-x-4">

                                    <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
                                        <h2 className="font-medium text-gray-800 dark:text-white">
                                            Hi, I'm Flow Bot, your friendly course planning assistant.
                                        </h2>
                                        <div className="space-y-1.5">
                                            <p className="mb-1.5 text-sm text-gray-800 dark:text-white">
                                                You can ask questions like:
                                            </p>
                                            <ul className="list-disc list-outside space-y-1.5 ps-3.5">
                                                <li className="text-sm text-gray-800 dark:text-white">
                                                    What courses cover stocks and valuations?
                                                </li>

                                                <li className="text-sm text-gray-800 dark:text-white">
                                                    I'm very interested in film, what's some courses that study horror movies?
                                                </li>

                                                <li className="text-sm text-gray-800 dark:text-white">
                                                    Who made Laurier Flow?
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </li>

                                {messages.map((message) => {
                                    if (message.messageType === "prompt") {
                                        return PromptBubble(message.text)
                                    } else if (message.messageType === "response") {
                                        return ResponseBubble(message.text)
                                    }
                                })}

                                {loading ? <div className="animate-spin inline-block w-10 h-10 border-[3px] border-current border-t-transparent text-orange-600 rounded-full" role="status" aria-label="loading">
                                    <span className="sr-only">Loading...</span>
                                </div> : null}
                            </ul>
                        </div>
                        <div className="flex flex-col items-center w-full">
                            <h1 className="text-white text-sm font-thin pb-4 pt-2">Powered by gpt-4-turbo</h1>
                            <div className="flex flex-row items-center pb-6 px-6 w-full rounded-b-lg gap-4">
                                <div className="space-y-3 flex-1">
                                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} disabled={loading} type="text" className="py-3 px-4 block w-full border-gray-200 rounded-lg text-base focus:border-secondary disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-gray-700 dark:text-white dark:placeholder-white focus:ring-secondary" placeholder="Ask a question..." />
                                </div>
                                <button
                                    type="button"
                                    disabled={loading}
                                    onClick={handleSubmit}
                                    className="flex border-t-2 border-slate-600 items-center justify-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-secondary text-white disabled:opacity-50 disabled:pointer-events-none h-10 w-10"
                                >
                                    <SendHorizonal />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <HomeFooter />
        </div>
    )
}

function PromptBubble(text: string) {
    return (
        <li className="max-w-lg ms-auto flex justify-end gap-x-2 sm:gap-x-4">
            <div className="grow text-end space-y-3">
                <div className="inline-block bg-secondary rounded-2xl p-4 shadow-sm">
                    <p className="text-sm text-white">
                        {text}
                    </p>
                </div>
            </div>
        </li>
    )
}

function ResponseBubble(text: string) {
    return (
        <li className="max-w-lg flex gap-x-2 sm:gap-x-4">
            <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3 dark:bg-neutral-900 dark:border-neutral-700">
                <p className="text-sm text-gray-800 dark:text-white" dangerouslySetInnerHTML={{ __html: text }}></p>
            </div>
        </li>
    )
}