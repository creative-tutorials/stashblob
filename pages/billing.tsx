import Head from "next/head";
import { useState, useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { ExternalLink, Archive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

type typeBill = {
  status: {
    hasPaid: boolean;
    amount: string;
  };
  uploadUsage: {
    total: number;
    used: number;
  };
  sharedUsage: {
    total: number;
    used: number;
  };
};

export default function Billing() {
  const [progress, setProgress] = useState(0);
  const [renderCount, setRenderCount] = useState(0);
  const [billObj, setBillObj] = useState<typeBill>({
    status: {
      hasPaid: false,
      amount: "$0",
    },
    uploadUsage: {
      total: 0,
      used: 0,
    },
    sharedUsage: {
      total: 0,
      used: 0,
    },
  });
  const { isSignedIn, user, isLoaded } = useUser();

  // useEffect(() => {
  //   const timer = setTimeout(() => setProgress(3), 500);
  //   return () => clearTimeout(timer);
  // }, []);

  useEffect(() => {
    setRenderCount((prev) => prev + 1);

    renderCount === 1 && getBillingStatus();

    async function getBillingStatus() {
      if (!isLoaded || !isSignedIn) {
        return null;
      } else {
        const userid = user.id;
        axios
          .get(`http://localhost:8080/billing/${userid}`, {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
            },
          })
          .then(async function (response) {
            console.log(response.data);
            setBillObj((prev) => {
              return {
                ...prev,
                status: {
                  hasPaid: response.data.hasPaid,
                  amount: response.data.amount,
                },
                uploadUsage: {
                  total: response.data.uploadUsage.total,
                  used: response.data.uploadUsage.used,
                },
                sharedUsage: {
                  total: response.data.sharedUsage.total,
                  used: response.data.sharedUsage.used,
                },
              };
            });
          })
          .catch(async function (error) {
            console.error(error.response);
          });
      }
    }

    return () => {
      setRenderCount(0);
    };
  }, [renderCount, isLoaded, isSignedIn, user?.id]);

  return (
    <>
      <Head>
        <title>Billing</title>
        <meta
          name="description"
          content="Worry about your files than our pricing"
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
        <meta property="og:title" content="Billing" />
        <meta
          property="og:description"
          content="Worry about your files than our pricing"
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1693019282/brave_screenshot_localhost_1_hog6fw.png"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="resubase.vercel.app" />
        <meta property="twitter:url" content="https://resubase.vercel.app" />
        <meta name="twitter:title" content="Billing" />
        <meta
          name="twitter:description"
          content="Worry about your files than our pricing"
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1693019282/brave_screenshot_localhost_1_hog6fw.png"
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
      <header className="fixed top-0 w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-borderbtm flex items-center justify-between">
        <div className="">
          <Link href="/dashboard">
            <Image
              src="/assets/TransparentBlob.png"
              width={150}
              height={42}
              placeholder="blur"
              className="md:w-[150px] lg:w-[150px] w-[120px]"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
              alt="forget logo"
            />
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          {/* account */}
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-lightgrey bg-transparent transition-colors hover:text-white p-2 rounded-md"
          >
            Dashboard
          </Link>
          <Link
            href="/docs"
            className="flex items-center gap-1 text-lightgrey bg-transparent transition-colors hover:text-white p-2 rounded-md"
          >
            Docs
          </Link>
          <UserButton />
        </nav>
      </header>
      <main className="p-10 md:mt-20 lg:mt-20 mt-10">
        <section>
          <hgroup className="flex flex-col gap-4">
            <h1 className="md:text-5xl lg:text-5xl text-4xl font-medium text-white font-Noto">
              Billing
            </h1>
            <h3 className="md:text-base lg:text-base text-sm font-normal text-white/70 font-Noto">
              Manage your billing and payment details.
            </h3>
          </hgroup>
        </section>
        <section className="mt-8">
          <h3 className="md:text-3xl lg:text-3xl text-2xl font-medium text-white">
            Cloud Usage
          </h3>
          <div className="w-full h-full mt-4 flex flex-wrap items-stretch md:gap-14 lg:gap-14 gap-4">
            <section className="bg-blackmid border border-hovergrey rounded-lg shadow-md p-4 w-full max-w-[43rem] h-auto flex flex-col relative">
              <div className="flex flex-wrap md:gap-0 lg:gap-0 gap-4 items-center justify-between">
                <hgroup className="flex gap-4">
                  <p className="text-white text-xl font-medium">Basic Plan</p>
                  <Badge className="bg-[#dfe9f5] text-[#3864ac] py-[0.1rem]">
                    Monthly
                  </Badge>
                </hgroup>
                <hgroup>
                  <h2 className="text-4xl font-medium text-midwhite2">
                    $0<span className="text-base font-normal">/month</span>
                  </h2>
                </hgroup>
              </div>
              <div className="md:mt-4 lg:mt-4 mt-6">
                <span className="text-midwhite">
                  {billObj.uploadUsage.used}% of 2GB used
                </span>
              </div>
              <div className="mt-4 w-full h-auto">
                <div className="absolute w-full bottom-12 right-0 bg-[#1a1b1e] h-[0.1rem]"></div>
                <div className="mt-6 w-full flex items-end justify-end m-auto">
                  <Link
                    href="/"
                    className="flex items-center gap-3 transition-all text-linkclr hover:text-fileicon hover:underline"
                  >
                    Upgrade plan <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </section>
            <section className="bg-blackmid border border-hovergrey rounded-lg shadow-md p-4 w-full max-w-[43rem] h-auto flex flex-col relative">
              <div className="">
                <hgroup className="flex gap-4">
                  <p className="text-white text-xl font-medium">Shared Files</p>
                  <Badge className="bg-[#dfe9f5] text-[#3864ac] py-[0.1rem]">
                    <Archive />
                  </Badge>
                </hgroup>
              </div>
              <div className="mt-4">
                <span className="text-midwhite flex">
                  <h4 className="text-4xl">{billObj.sharedUsage.used}</h4> files shared
                </span>
              </div>
              <div className="absolute right-0 top-0 md:block lg:block hidden">
                <svg
                  // width="217"
                  // height="217"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="fill-[#80a2e718] w-44 h-44"
                >
                  <path d="M22 13.126A6 6 0 0 0 13.303 21H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h7.414l2 2H21a1 1 0 0 1 1 1v7.126ZM18 17v-3.5l5 4.5-5 4.5V19h-3v-2h3Z"></path>
                </svg>
              </div>
            </section>
          </div>
        </section>
      </main>
    </>
  );
}
