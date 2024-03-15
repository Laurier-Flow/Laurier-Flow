"use client";

import "@/app/globals.css";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CirclesWithBar } from "react-loader-spinner";
import LoadingSpinner from "@/components/LoadingSpinner";

// export const metadata = {
//   title: "Laurier Flow",
//   description: "The best way to plan your Laurier schedule",
// };

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}): React.ReactElement {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <html lang="en">
            <body className="bg-background text-foreground w-full h-full flex flex-col">
                {loading ? (
                    <LoadingSpinner loading={loading} />
                ) : (
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange>
                        <Header />
                        <main className="justify-center w-full min-h-[100dvh]">
                            {children}
                        </main>
                        <Footer />
                    </ThemeProvider>
                )}
            </body>
        </html>
    );
}
