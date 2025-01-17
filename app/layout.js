import Header from "@/components/Header/Header";
import AuthProvider from "@/contexts/auth";
import "@/styles/globals.css";


export const metadata = {
  title: "BH Remodeling INC.",
  description: "BH Remodeling INC.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <AuthProvider>
        <Header />
        <main>
          {children}
        </main>
        </AuthProvider>
      </body>
    </html>
  )
}
