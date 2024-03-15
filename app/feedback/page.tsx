"use client";
import Spinner from "@/components/Spinner";
import { Suspense } from "react";
import Script from "next/script";

export default function About() {
  return (
    <Suspense
      fallback={
        <div className="w-full h-full">
          <Spinner />
        </div>
      }
    >
      <div className="min-w-full flex flex-col p-4 dark:bg-[url('/banner-sm.jpg')] bg-[url('/banner-sm-light.jpg')] md:dark:bg-[url('/banner-md.jpg')] md:bg-[url('/banner-md-light.jpg')] lg:dark:bg-[url('/banner.jpg')] lg:bg-[url('/banner-light.jpg')] md:flex-row md:justify-center">
        <div className="flex flex-1 pt-20 flex-row justify-between w-f max-w-6xl">
          <div className="flex flex-1 flex-col justify-end pl-4">
            <h1 className="mb-2 text-2xl font-bold md:text-5xl">
              Feedback Page
            </h1>
          </div>
        </div>
      </div>

      <div className="card">
        <iframe
          data-tally-src="https://tally.so/embed/wkyNGZ?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
          title="Feedback Form"
        ></iframe>
        <Script
          id="tally-js"
          src="https://tally.so/widgets/embed.js"
          onLoad={() => {
            Tally.loadEmbeds();
          }}
        />
      </div>
    </Suspense>
  );
}
