import "@/app/globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {

  return (
    <html lang="en">
      <body className="bg-background items-center text-foreground w-full h-screen flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header />
            <main className="justify-center flex-grow">
              {children}
            </main>
          </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
