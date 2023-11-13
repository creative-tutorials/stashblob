import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import ReactPlayer from "react-player";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Search, ChevronLeft, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, Suspense, Fragment } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommandBx } from "@/components/app/command-bx";
import axios from "axios";

import LightImage from "@/public/assets/TransparentBlob White.png";
import DarkImage from "@/public/assets/TransparentBlob Color.png";

type fileProp = {
  date: string;
  name: string;
  size: string;
  type: string;
  url: string;
};

// export const runtime = "nodejs"

export default function FileRouter() {
  const router = useRouter();
  const { uploadid } = router.query;
  const { isSignedIn, user, isLoaded } = useUser();
  const [dataLoading, setDataLoading] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [open, setOpen] = useState(false);
  const [regexImg, setRegexImg] = useState(
    /(image\/png|image\/jpg|image\/jpeg|image\/avif)$/
  );
  const [regexVideo, setRegexVideo] = useState(
    /(video\/mp4|video\/webm|video\/ogg)$/
  );
  const { toast } = useToast();
  const [counter, setCounter] = useState(0);
  const [file, setFile] = useState<fileProp>({
    date: "",
    name: "",
    size: "",
    type: "",
    url: "",
  });

  useEffect(() => {
    setCounter((prev) => prev + 1);

    counter === 1 && previewFile();

    return () => {
      setCounter(0);
    };
  }, [counter, uploadid, isLoaded, isSignedIn]);

  async function previewFile() {
    setDataLoading(true);
    if (!isLoaded) {
      return null;
    }

    if (isSignedIn) {
      const userid = user.id;
      // console.log(userid)
      axios
        .get(`http://localhost:8080/preview/${uploadid}/${userid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          console.info("returned file object");
          setDataLoading(false);
          setIsRendered(true);
          setFile((prev: fileProp) => {
            return {
              ...prev,
              date: response.data.data.date,
              name: response.data.data.filename,
              size: response.data.data.filesize,
              type: response.data.data.filetype,
            };
          });
          await generateImage(response.data.data.filename);
        })
        .catch(async function (error) {
          console.error(error.response);
          setDataLoading(false);
          setIsRendered(false);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.error,
          });
        });
    }
  }

  async function generateImage(filename: string) {
    axios
      .post(
        "http://localhost:8080/gen/file",
        {
          filename: filename,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      )
      .then(async function (response) {
        console.info("file IV0 generated");
        setFile((prev: fileProp) => {
          return {
            ...prev,
            url: response.data.iv0,
          };
        });
      })
      .catch(async function (error) {
        console.log(error.response);
      });
  }

  const downloadFile = async (
    name: string | string[] | undefined,
    id: string | string[] | undefined
  ) => {
    if (isSignedIn) {
      const userid = user.id;
      toast({
        description: "Please wait...",
      });
      axios
        .get(`http://localhost:8080/download/${name}/${id}/${userid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          await router.push(response.data.message);
        })
        .catch(async function (error) {
          console.error(error.response);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        });
    }
  };

  const deleteFile = async (
    name: string | string[] | undefined,
    id: string | string[] | undefined
  ) => {
    if (isSignedIn) {
      const userid = user.id;
      const username = user.username;
      toast({
        description: "Please wait...",
      });
      axios
        .delete(`http://localhost:8080/delete/${name}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: userid,
          },
        })
        .then(async function (response) {
          console.log(response.data);
          toast({
            title: "Success",
            description: response.data.message,
          });
          await resetBilling(userid, username);
          // await previewFile();
        })
        .catch(async function (error) {
          console.error(error.response);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response,
          });
        });
    }
  };

  async function resetBilling(userid: string, username: string | null) {
    axios
      .post(
        "http://localhost:8080/reset/billing",
        {
          userid: userid,
          username: username,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        }
      )
      .then(async function (response) {
        console.log(response.data);
        await previewFile();
      })
      .catch(async function (error) {
        console.error(error);
      });
  }

  return (
    <>
      <Head>
        <title>FileRouter</title>
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
        <meta property="og:title" content="FileRouter" />
        <meta
          property="og:description"
          content="Easy way to share files with anyone without any hicups. Just upload and share."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1697331302/Site_Rollup_pmxaos.jpg"
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content="stashblobweb.vercel.app" />
        <meta
          property="twitter:url"
          content="https://stashblobweb.vercel.app"
        />
        <meta name="twitter:title" content="FileRouter" />
        <meta
          name="twitter:description"
          content="Easy way to share files with anyone without any hicups. Just upload and share."
        />
        <meta
          name="twitter:image"
          content="https://res.cloudinary.com/derbreilm/image/upload/v1697331302/Site_Rollup_pmxaos.jpg"
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
      <header className="fixed top-0 w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4  dark:bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-borderbtm/20 dark:border-b-borderbtm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Image
              src={DarkImage}
              width={150}
              height={42}
              placeholder="blur"
              className="md:w-[150px] lg:w-[150px] w-[120px] block dark:hidden"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
              alt="forget logo"
            />
            <Image
              src={LightImage}
              width={150}
              height={42}
              placeholder="blur"
              className="md:w-[150px] lg:w-[150px] w-[120px] hidden dark:block"
              blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
              alt="forget logo"
            />
          </Link>
          {/* <Link href='/' className="text-lg text-hashtext"><span>Dashboard</span> / <span>File Router</span> / <span>{id}</span></Link> */}
          <span className="text-base dark:text-hashtext text-blackmid md:block lg:block hidden">
            <Link href="/dashboard">Dashboard</Link> /{" "}
            <Link href="/file">File Router</Link> /{" "}
            <Link
              href={`/file/${uploadid}`}
              className="dark:text-white text-blackmid"
            >
              {file.name ? file.name.substring(0, 10) + "...." : "shadcn.png"}
            </Link>
          </span>
        </div>
        <nav className="flex items-center md:gap-4 lg:gap-4 gap-3">
          {/* account */}
          <Link
            href={`/file/${uploadid}`}
            className="dark:text-white text-blackmid"
            onClick={(e) => {
              e.preventDefault();
              setOpen(true);
            }}
          >
            <Search className="md:w-6 lg:w-6 md:h-6 lg:h-5 w-4 h-5" />
          </Link>
          <Link
            href="https://post-io.gitbook.io/stashblob-docs/"
            target="_blank"
            className="dark:text-white text-blackmid md:text-base lg:text-base text-sm"
          >
            Docs
          </Link>
          <UserButton />
        </nav>
      </header>
      <nav className="w-full dark:bg-thirdprop bg-white border border-transparent dark:border-b-darkbtnhover border-b-borderbtm/30 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-[4.5rem]">
        <div className="flex items-baseline gap-3">
          <Link href="/dashboard">
            <ChevronLeft className="dark:text-midwhite text-black" />
          </Link>
          <h1 className="md:text-4xl lg:text-4xl text-lg dark:text-midwhite text-black">
            {file.name ? file.name.substring(0, 17) + "..." : "shadcn.png"}
          </h1>
        </div>
      </nav>
      {dataLoading ? (
        <div className="mt-4 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full dark:bg-darkbtnhover bg-borderbtm/30" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px] dark:bg-darkbtnhover bg-borderbtm/30" />
              <Skeleton className="h-4 w-[200px] dark:bg-darkbtnhover bg-borderbtm/30" />
            </div>
          </div>
        </div>
      ) : (
        <Fragment>
          {isRendered ? (
            <main className="mt-20 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4 flex flex-col gap-4">
              <section className="p-6 rounded-md dark:bg-thirdprop bg-white border dark:border-darkbtn/50 border-borderbtm/20 relative">
                <div className="flex md:flex-row lg:flex-row flex-col items-stretch gap-10">
                  <div className="flex md:flex-row lg:flex-row flex-col items-stretch gap-4">
                    {file.url ? (
                      <>
                        {file.type.match(regexImg) && (
                          <Image
                            src={
                              file.url
                                ? file.url
                                : "https://qhgpubnqzskccobolzai.supabase.co/storage/v1/object/public/meta/uishadcn.jpg"
                            }
                            width={300}
                            height={300}
                            placeholder="blur"
                            blurDataURL={
                              "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPk5ROoBwABBwCsavOgUgAAAABJRU5ErkJggg=="
                            }
                            alt={"Your file"}
                            className="rounded-md"
                          />
                        )}
                        {file.type.match(regexVideo) && (
                          <video
                            src={file.url}
                            width={500}
                            height={300}
                            autoPlay
                            muted
                            loop
                            controls={false}
                            className="rounded-md"
                          ></video>
                        )}
                      </>
                    ) : (
                      <div className="bg-darkbtnhover h-[300px] w-[300px] rounded-md animate-pulse"></div>
                    )}
                    <p className="text-lg dark:text-white text-blackmid">
                      {file.name
                        ? file.name.substring(0, 10) + "...."
                        : "shadcn.png"}
                    </p>
                  </div>
                  <Suspense fallback={<p>Loading</p>}>
                    <div className="">
                      <article>
                        <p className="dark:text-hashtext text-blackmid">
                          MIME Type: {file.type ? file.type : "image/png"}
                        </p>
                        <p className="dark:text-hashtext text-blackmid">
                          Size: {file.size ? file.size : "15.42KB"}
                        </p>
                        <p className="dark:text-hashtext text-blackmid">
                          Created: {file.date ? file.date : "Apr 26 2020"}
                        </p>
                      </article>
                    </div>
                  </Suspense>
                </div>
                <div className="mt-5 overflow-hidden">
                  <div className="w-full border border-transparent dark:border-t-borderbtm border-t-borderbtm/30 absolute bottom-18 left-0"></div>
                  <div className="mt-5 flex items-end justify-end">
                    <Button
                      className="dark:bg-darkmxbtn bg-royalblue hover:bg-royalglue border border-transparent dark:border-darkbtn text-white flex items-center gap-2 p-5"
                      onClick={() => downloadFile(file.name, uploadid)}
                    >
                      <ArrowDownToLine /> Download
                    </Button>
                  </div>
                </div>
              </section>
              <section className="p-6 rounded-md dark:bg-thirdprop bg-white border dark:border-[#e89797]/50 border-[#de3737] relative">
                <hgroup className="flex flex-col gap-2">
                  <h3 className="dark:text-[#e89797] text-[#de3737] text-2xl">
                    Danger Zone
                  </h3>
                  <p className="dark:text-hashtext text-secondpro text-sm">
                    The file will be deleted permanently. This action is
                    irreversible and cannot be undone.
                  </p>
                </hgroup>
                <div className="flex items-end justify-end md:mt-auto lg:mt-auto mt-8">
                  <Button
                    variant={"destructive"}
                    className="bg-danger_red text-white hover:bg-fire"
                    onClick={() => deleteFile(file.name, uploadid)}
                  >
                    Delete this file
                  </Button>
                </div>
              </section>
            </main>
          ) : (
            <main>
              <h2>Error</h2>
            </main>
          )}
        </Fragment>
      )}
      <CommandBx open={open} setOpen={setOpen} />
      <Toaster />
    </>
  );
}
