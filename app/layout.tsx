import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import "./globals.css";
import { Open_Sans } from "next/font/google";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
export const metadata: Metadata = {
  title: "VibNet",
  description: "Stay connected and match your vibe on VibNet",
};
const font = Open_Sans({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={cn(`${font.className} bg-white dark:bg-[#313338] antialiased`)}>
          <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="vibenet-theme"
          >
            <SignedOut></SignedOut>
            <SignedIn></SignedIn>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
