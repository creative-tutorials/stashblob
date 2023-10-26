import "@/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider
      {...pageProps}
      appearance={{
        baseTheme: dark,
        elements: {
          card: {
            background: "#111113",
            // borderRadius: "5px"
          },
          formButtonPrimary: "bg-[#7148FC] text-white hover:bg-[#7148FC]/80",
          footerActionLink: "text-[#C084FC] hover:text-[#C084FC]/80",
          formButtonReset: "hover:bg-[#7148FC]/30 text-[#5748AE]",
          avatarImageActionsUpload: "text-[#5748AE]",
          badge: "bg-[#5748AE]/40 text-[#7148FC]"
          
        },
      }}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}
