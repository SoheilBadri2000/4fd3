import "./globals.css";

export const metadata = {
  title: "Smart Medical Assistant",
  description: "Get general information about your symptoms.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <p className="disclaimer">
          This tool provides general information only and is not a substitute
          for professional medical advice.
        </p>
      </body>
    </html>
  );
}
