import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { fetchUser } from "@/utils/supabase/authActions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactElement> {
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
