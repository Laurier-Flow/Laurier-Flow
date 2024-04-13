import React from "react";
import SearchBar from "./search/SearchBar";
import { BackgroundGradientAnimation } from "@/components/background-gradient-animation";

export default function Index(): React.ReactElement {
  return (
    <div className="relative flex justify-center items-center h-screen">
      <div className="fixed inset-0 z-0">
        <BackgroundGradientAnimation />
      </div>
      <div className="relative z-10">
        <SearchBar />
      </div>
    </div>
  );
}