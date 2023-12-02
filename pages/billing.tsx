import Head from "next/head";
import { useState, useEffect, Suspense } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/app/bill/Header";
import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import { BillingBrk } from "@/components/app/bill/layout/bill-break";
import { Plans } from "@/components/app/bill/layout/plans";
import { PlanStats } from "@/components/app/bill/layout/plans/stats";
import { StorageSense } from "@/components/app/bill/layout/storage";
import { TailSpinner } from "@/components/app/animation/tail-spin";

type typeBill = {
  status: {
    hasPaid: boolean;
    amount: string;
  };
  uploadUsage: {
    total: number;
    used: number;
    totalString: string;
  };
  sharedUsage: {
    total: number;
    used: number;
  };
};

export default function Billing() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [billObj, setBillObj] = useState<typeBill>({
    status: {
      hasPaid: false,
      amount: "$0",
    },
    uploadUsage: {
      total: 0,
      used: 0,
      totalString: "",
    },
    sharedUsage: {
      total: 0,
      used: 0,
    },
  });
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && getBillingStatus();

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn, user?.id]);

  async function getBillingStatus() {
    setLoading(true);
    if (!isSignedIn) {
      return null;
    } else {
      const userid = user.id;
      axios
        .get(`${APIURL}/billing/${userid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          setLoading(false);

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
                totalString: response.data.uploadUsage.totalString,
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
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: error.response.data.error,
          });
          setLoading(false);
        });
    }
  }

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
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
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
      <main className="md:p-10 lg:p-10 p-4 mt-20 flex flex-col gap-4">
        <Suspense fallback={<p>Loading...</p>}>
          <Plans />
          {loading ? (
            <TailSpinner />
          ) : (
            <>
              <PlanStats
                loading={loading}
                hasPaid={billObj.status.hasPaid}
                totalString={billObj.uploadUsage.totalString}
              />
              <StorageSense />
              <BillingBrk
                router={router}
                loading={loading}
                totalString={billObj.uploadUsage.totalString}
                used={billObj.uploadUsage.used}
              />
            </>
          )}
        </Suspense>
      </main>
      <Toaster />
    </>
  );
}
