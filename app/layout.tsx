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
      <body className="bg-background text-foreground h-screen flex flex-col">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange>
            <Header />
            <main className="flex grow justify-center">
              {children}
            </main>
          </ThemeProvider>
        <Footer />
      </body>
    </html>
  );
}
