import Head from "next/head";
import { Header } from "@/components/app/bill/Header";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
export default function Settings() {
  const { setTheme } = useTheme();
  return (
    <>
      <Head>
        <title>General / Theme</title>
        <meta
          name="description"
          content="Manage account themes integrations and more."
        />
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
        <meta property="og:title" content="General / Theme" />
        <meta
          property="og:description"
          content="Manage account themes integrations and more."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="resubase.vercel.app" />
        <meta property="twitter:url" content="https://resubase.vercel.app" />
        <meta name="twitter:title" content="General / Theme" />
        <meta
          name="twitter:description"
          content="Manage account themes integrations and more."
        />
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
      <Header />
      <main className="md:p-10 lg:p-10 p-4 mt-20">
        <section>
          <hgroup className="flex flex-col gap-4">
            <h2 className="text-black dark:text-white text-3xl font-medium">
              Select Theme
            </h2>
            <span className="text-darkbtn dark:text-hashtext">
              Customize the app however you like, make it your own.
            </span>
          </hgroup>
          <div className="flex md:flex-row lg:flex-row flex-col items-stretch gap-4 mt-10">
            <div
              className="bg-lightgrey w-full max-w-[45rem] rounded-md transition-colors border-2 border-purplebtn dark:border-borderbtm dark:bg-darkbtnhover"
              onClick={() => setTheme("light")}
            >
              <div className="md:p-10 lg:p-10 p-2">
                <div className="p-4 bg-white h-48 rounded-md flex items-center justify-center">
                  <Sun className="text-darkbtn dark:text-hashtext/10 w-20 h-20" />
                </div>
              </div>
              <article className="p-4 bg-whitebg dark:bg-darkestbg rounded-b-md text-white">
                <span className="text-black dark:text-white font-medium">
                  Light Mode
                </span>
              </article>
            </div>
            <div
              className="bg-lightgrey w-full max-w-[45rem] rounded-md transition-colors border-2 border-transparent dark:border-purplebtn dark:bg-darkbtnhover"
              onClick={() => setTheme("dark")}
            >
              <div className="md:p-10 lg:p-10 p-2">
                <div className="p-4 bg-gradient-to-tr from-secondpro to-darkbtnhover dark:from-blackmid dark:to-thirdprop border border-borderbtm/80 h-48 rounded-md flex items-center justify-center">
                  <Moon className="text-darkbtn/10 dark:text-hashtext w-20 h-20" />
                </div>
              </div>
              <article className="p-4 bg-whitebg dark:bg-darkestbg rounded-b-md text-white">
                <span className="text-black dark:text-white font-medium">
                  Dark Mode
                </span>
              </article>
            </div>
          </div>
        </section>
        <section></section>
      </main>
    </>
  );
}
