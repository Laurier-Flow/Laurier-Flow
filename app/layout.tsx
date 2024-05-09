import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer";
import { Metadata } from "next"
const FormWidget = dynamic(() => import("@/components/FormWidget"), {ssr: false});

export const metadata : Metadata = {
  title: {
    template: "%s | Laurier Flow",
    absolute: "Laurier Flow",
    default: "Laurier Flow",
  },
  description: "The best way to plan your Laurier schedule",
};

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
          <FormWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}
