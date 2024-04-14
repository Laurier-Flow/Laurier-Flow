import React from "react";
import SearchBar from "./search/SearchBar";
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";

export default function Index(): React.ReactElement {
  return (
    <div className="relative flex justify-center items-center h-screen">
      <div className="fixed inset-0 z-0">
        <BackgroundGradientAnimation />
      </div>
      <div className="relative z-10 max-w-6xl">
        <h1 className="text-5xl font-bold leading-tight mb-6">Explore thousands of course and professor reviews from Laurier students</h1>
        <SearchBar />
        <h1 className="text-lg font-normal italic mt-6">Plan your courses • Read course and professor reviews • Find classes</h1>
      </div>
    </div>
  );
}