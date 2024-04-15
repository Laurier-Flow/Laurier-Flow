import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CirclesWithBar } from "react-loader-spinner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useEffect, useState } from "react";

// export const metadata = {
//   title: "Laurier Flow",
//   description: "The best way to plan your Laurier schedule",
// };

export default function RootLayout({
    children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-background text-foreground h-screen flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex grow justify-start items-center flex-col">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body> 
    </html>
  );
}
