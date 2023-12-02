import Head from "next/head";
import axios from "axios";
import { APIURL } from "@/config/apiurl";
import { useUser } from "@clerk/nextjs";
import { CommandBx } from "@/components/app/command-bx";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Files } from "@/components/studio/Files";
import { ModalUI } from "@/components/app/modal-ui";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import { Header } from "@/components/app/Header";
import { useState, useEffect } from "react";
import { booleanType, typeCounter } from "@/types/appx";

type FolderData = {
  folderID: string;
  folderName: string;
  files: [];
};

export default function FolderRouter() {
  const router = useRouter();
  const { toast } = useToast();
  const { isSignedIn, user } = useUser();
  const { folderid } = router.query;
  const [open, setOpen] = useState<booleanType>(false);
  const [count, setCount] = useState<typeCounter>(0);

  const [dataLoading, setDataLoading] = useState<booleanType>(false);
  const [show, setShow] = useState<booleanType>(false);
  const [foldername, setFoldername] = useState("");
  const [files, setFiles] = useState([]);
  const [isErr, setIsErr] = useState<booleanType>(false);

  useEffect(() => {
    setCount((prev) => prev + 1);

    count === 1 && fetchFiles();

    return () => {
      setCount(0);
    };
  }, [count, isSignedIn]);

  async function fetchFiles() {
    // return;
    if (!isSignedIn) {
      return;
    } else {
      setIsErr(false);
      setDataLoading(true);
      axios
        .get(`${APIURL}/read/folder/${folderid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: user.id,
          },
        })
        .then(async function (response) {
          const data: FolderData = response.data.data;
          setFiles(data.files);
          setFoldername(data.folderName);
          setIsErr(false);
          setDataLoading(false);
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsErr(true);
          setDataLoading(false);
          toast({
            variant: "destructive",
            title: "Something's not right",
            description: error.response.data.error,
          });
        });
    }
  }

  return (
    <>
      <Head>
        <title>FolderRouter</title>
        <meta
          name="description"
          content="Easy way to share files with anyone without any hicups. Just upload and share."
        />
        <meta
          name="keywords"
          content="Cloud Storage, File Sharing, Storage Bucket, Dropbox, StashBlob"
        />
        <meta
          name="google-site-verification"
          content="l1a2fyP4jz21WqSIR2HNxLAyt__hUNkV-48f_zbVHYE"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:url" content="https://stashblobweb.vercel.app" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FolderRouter" />
        <meta
          property="og:description"
          content="Easy way to share files with anyone without any hicups. Just upload and share."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stashblobweb.vercel.app" />
        <meta
          property="twitter:url"
          content="https://stashblobweb.vercel.app"
        />
        <meta name="twitter:title" content="FolderRouter" />
        <meta
          name="twitter:description"
          content="Easy way to share files with anyone without any hicups. Just upload and share."
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
      <div>
        <Header setOpen={setOpen} open={open} />
        <main>
          <div className="md:p-10 lg:p-10 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-20">
            <div className="mt-2">
              <section>
                <div id="links">
                  <span className="flex items-center gap-1">
                    <Link href="/dashboard">My Files</Link>{" "}
                    <ChevronRight className="w-4 h-4" />{" "}
                    <Link href={`/folder/${folderid}`} className="font-medium">
                      {foldername}
                    </Link>
                  </span>
                </div>
                <Separator className="h-[0.01rem] w-full bg-borderbtm/40 mt-4" />
              </section>
              <section className="mt-4">
                <Files
                  files={files}
                  dataLoading={dataLoading}
                  isErr={isErr}
                  fetchFiles={fetchFiles}
                  setShow={setShow}
                />
              </section>
            </div>
          </div>
        </main>
        <CommandBx open={open} setOpen={setOpen} />
        <ModalUI show={show} setShow={setShow} />
      </div>
      <Toaster />
    </>
  );
}
