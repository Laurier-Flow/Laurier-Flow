"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare var HSStaticMethods: {
  autoInit(collection?: string | string[]): void;
};

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    import("preline/preline");
  }, []);

  useEffect(() => {
    setTimeout(() => {
      HSStaticMethods.autoInit();
    }, 100);
  }, [path]);

  return null;
}