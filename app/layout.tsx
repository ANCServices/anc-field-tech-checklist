import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ANC Field Tech Checklist",
  description: "Mobile-friendly event day checklist for ANC field techs."
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
