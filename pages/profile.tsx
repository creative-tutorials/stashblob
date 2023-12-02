import { UserProfile } from "@clerk/nextjs";
import Head from "next/head";
import { Header } from "@/components/app/Header";
import { CommandBx } from "@/components/app/command-bx";
import { useState } from "react";
import { booleanType } from "@/types/appx";

export default function Profile() {
  const [open, setOpen] = useState<booleanType>(false);

  return (
    <>
      <Head>
        <title>General / Account</title>
        <meta name="description" content="Manage your Profile" />
        <meta
          name="keywords"
          content="Cloud Storage, File Sharing, Resubase, Storage Bucket, Dropbox"
        />
        <meta
          name="google-site-verification"
          content="l1a2fyP4jz21WqSIR2HNxLAyt__hUNkV-48f_zbVHYE"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="https://resubase.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="General / Account" />
        <meta property="og:description" content="Manage your Profile" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="resubase.vercel.app" />
        <meta property="twitter:url" content="https://resubase.vercel.app" />
        <meta name="twitter:title" content="General / Account" />
        <meta name="twitter:description" content="Manage your Profile" />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=2"
        />
        <link rel="icon" href="/favicon.ico?v=2" sizes="any" />
      </Head>
      <Header setOpen={setOpen} open={open} />
      <main className="flex items-center justify-center mt-20">
        <UserProfile />
      </main>
      <CommandBx open={open} setOpen={setOpen} />
    </>
  );
}
