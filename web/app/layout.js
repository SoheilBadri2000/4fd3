import "./globals.css";
import Navbar from "./Navbar";

export const metadata = {
  title: "Smart Medical Assistant",
  description: "Get structured guidance about your symptoms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
