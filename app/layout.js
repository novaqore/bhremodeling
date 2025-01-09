import Header from "@/components/Header/Header";
import AppProvider from "@/contexts/AppContext";
import "@/styles/globals.css";


export const metadata = {
  title: "BH Remodeling INC.",
  description: "BH Remodeling INC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
        <Header />
        <main className="pt-10 mx-auto">
          {children}
        </main>
        </AppProvider>
      </body>
    </html>
  )
}
