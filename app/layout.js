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
      <body className="bg-gray-100">
        <AppProvider>
        <Header />
        <main className="mx-auto pt-10">
          {children}
        </main>
        </AppProvider>
      </body>
    </html>
  )
}
