import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE } from "@/lib/site";

export const metadata = {
  title: `${SITE.name} — Online Courses`,
  description: SITE.description,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="page">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
