import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ThemeProvider } from "@/components/theme-provider";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ClerkProvider
        {...pageProps}
        appearance={{
          baseTheme: dark,
          elements: {
            card: {
              background: "#111113",
              // borderRadius: "5px"
            },
            formButtonPrimary: "bg-[#2559c0] text-white hover:bg-[#2559c0]/80",
            footerActionLink: "text-[#a5c5f6] hover:text-[#a5c5f6]/80",
            formButtonReset: "hover:bg-[#2559c0]/30 text-[#fefeff]",
            avatarImageActionsUpload: "text-[#2473c8]",
            badge: "bg-[#2473c8]/40 text-[#f3f6fd]",
          },
        }}
      >
        <Component {...pageProps} />
      </ClerkProvider>
    </ThemeProvider>
  );
}
