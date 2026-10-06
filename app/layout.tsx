import React from "react";
import { Inter as FontSans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";

const inter = FontSans({ subsets: ["latin"], variable: "--font-sans" });

const calSansHeading = localFont({
  src: "./fonts/CalSans-SemiBold.woff2",
  variable: "--font-heading",
  weight: "600",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("font-sans", inter.variable, calSansHeading.variable)}
    >
      <body
        className={cn(
          inter.variable,
          calSansHeading.variable,
          "font-sans tracking-[-0.25px] antialiased",
        )}
      >
        <NextTopLoader
          height={2}
          color="var(--color-blue-500)"
          showSpinner={false}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
