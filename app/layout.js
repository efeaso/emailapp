import "./globals.css";

import AuthProvider from "./context/AuthProvider";

export const metadata = {
  title: "Email Service",
  description: "Send Bulk Emails",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="m-3">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
