import { useRouter } from "next/router";
import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { TailSpin } from "react-loader-spinner";
import { UserButton } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Command, ChevronLeft, ArrowDownToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useState,
  useEffect,
  Suspense,
  Fragment,
  Dispatch,
  SetStateAction,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CommandBx } from "@/components/app/command-bx";
import axios from "axios";
import { APIURL } from "@/config/apiurl";

import LightImage from "@/public/assets/TransparentBlob White.png";
import DarkImage from "@/public/assets/TransparentBlob Color.png";
import {
  TypeErrProp,
  booleanType,
  typeCounter,
  typeObjBolean,
} from "@/types/appx";
import { SmallLoader } from "@/components/app/animation/sm-loader";

type fileProp = {
  date: string;
  name: string;
  size: string;
  type: string;
  url: string;
};

const regexImg = /(image\/png|image\/jpg|image\/jpeg|image\/avif)$/;
const regexVideo = /(video\/mp4|video\/webm|video\/ogg)$/;

export default function FileRouter() {
  const router = useRouter();
  const { uploadid } = router.query;
  const { isSignedIn, user, isLoaded } = useUser();
  const [dataLoading, setDataLoading] = useState<booleanType>(false);
  const [errProp, SeterrProp] = useState<TypeErrProp>({
    isErr: false,
    err: "",
  });
  const [open, setOpen] = useState<booleanType>(false);
  const [queuePoint, setQueuePoint] = useState<typeObjBolean>({
    queue1: false,
    queue2: false,
  });

  const { toast } = useToast();
  const [counter, setCounter] = useState<typeCounter>(0);
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
      axios
        .get(`${APIURL}/preview/${uploadid}/${userid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          console.info("returned file object");
          setDataLoading(false);
          SeterrProp({ ...errProp, isErr: false });
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
          SeterrProp({
            ...errProp,
            isErr: true,
            err: error.response.data.error,
          });

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
        `${APIURL}/gen/file`,
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
      setQueuePoint((prev: typeObjBolean) => {
        return {
          ...prev,
          queue1: true,
        };
      });
      axios
        .get(`${APIURL}/download/${name}/${id}/${userid}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          await router.push(response.data.message);
          setQueuePoint((prev: typeObjBolean) => {
            return {
              ...prev,
              queue1: false,
            };
          });
        })
        .catch(async function (error) {
          console.error(error.response);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
          setQueuePoint((prev: typeObjBolean) => {
            return {
              ...prev,
              queue1: false,
            };
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
      setQueuePoint((prev: typeObjBolean) => {
        return {
          ...prev,
          queue2: true,
        };
      });
      axios
        .delete(`${APIURL}/delete/${name}/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
            userid: userid,
          },
        })
        .then(async function (response) {
          console.log(response.data);

          await resetBilling(userid, username)
            .then(async function (message: any) {
              console.log(message);
              toast({
                title: "Success",
                description: message,
              });

              setQueuePoint((prev: typeObjBolean) => {
                return {
                  ...prev,
                  queue2: false,
                };
              });
              await previewFile();
            })
            .catch(async function (err) {
              console.error(err);

              setQueuePoint((prev: typeObjBolean) => {
                return {
                  ...prev,
                  queue2: false,
                };
              });
            });
        })
        .catch(async function (error) {
          console.error(error.response);
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response,
          });
          setQueuePoint((prev: typeObjBolean) => {
            return {
              ...prev,
              queue2: false,
            };
          });
        });
    }
  };

  async function resetBilling(userid: string, username: string | null) {
    axios
      .post(
        `${APIURL}/reset/billing`,
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
        return "File deleted successfully";
      })
      .catch(async function (error) {
        console.error(error);
        throw error; // throw error to catch it in parent
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
          content="https://res.cloudinary.com/derbreilm/image/upload/v1700921113/Site_Rollup_pk7dop.jpg"
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
      <Header
        DarkImage={DarkImage}
        LightImage={LightImage}
        uploadid={uploadid}
        setOpen={setOpen}
        file={file}
      />
      <nav className="w-full dark:bg-ledDark bg-white border border-transparent dark:border-b-darkbtnhover border-b-borderbtm/30 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-[4.5rem]">
        <div className="flex items-baseline gap-3">
          <Link href="/dashboard">
            <ChevronLeft className="dark:text-midwhite text-black" />
          </Link>
          <h1 className="md:text-4xl lg:text-4xl text-lg dark:text-midwhite text-black">
            {file.name ? file.name.substring(0, 17) + "..." : "shadcn.png"}
          </h1>
        </div>
      </nav>
      <Suspense fallback={<p>Loading</p>}>
        {dataLoading ? (
          <div className="mt-4 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4">
            <TailSpin
              height="80"
              width="80"
              color="#6f2dbd"
              ariaLabel="tail-spin-loading"
              radius="1"
              wrapperStyle={{}}
              wrapperClass=""
              visible={true}
            />
          </div>
        ) : (
          <Fragment>
            {errProp.isErr ? (
              <main className="flex items-center justify-center mt-8">
                <h2 className=" text-danger_forground">500: {errProp.err}</h2>
              </main>
            ) : (
              <main className="mt-2 md:p-14 lg:p-14 md:px-14 lg:px-14 p-4 flex flex-col gap-4">
                <section className="p-6 rounded-md dark:bg-ledDark bg-white border dark:border-darkbtn/50 border-borderbtm/20 relative">
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
                              className="rounded-md hover:cursor-zoom-in"
                              onClick={() =>
                                window.open(`${file.url}`, "_blank")
                              }
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
                              className="rounded-md hover:cursor-zoom-in"
                              onClick={() =>
                                window.open(`${file.url}`, "_blank")
                              }
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
                        className={`${
                          queuePoint.queue1
                            ? "bg-purupleg2/40 pointer-events-none"
                            : "bg-purupleg2 pointer-events-auto"
                        } transition-colors hover:bg-elemgf text-white flex items-center gap-2 p-5`}
                        onClick={() => downloadFile(file.name, uploadid)}
                      >
                        {queuePoint.queue1 ? (
                          <SmallLoader />
                        ) : (
                          <ArrowDownToLine />
                        )}{" "}
                        Download
                      </Button>
                    </div>
                  </div>
                </section>
                <section className="p-6 rounded-md dark:bg-ledDark bg-white border dark:border-[#f14242] border-[#de3737] relative">
                  <hgroup className="flex flex-col gap-2">
                    <h3 className="dark:text-white text-2xl font-medium">
                      Danger Zone
                    </h3>
                    <p className="dark:text-white text-sm">
                      The file will be deleted permanently. This action is
                      irreversible and cannot be undone.
                    </p>
                  </hgroup>
                  <div className="flex items-end justify-end md:mt-auto lg:mt-auto mt-8">
                    <Button
                      variant={"destructive"}
                      className={`${
                        queuePoint.queue2
                          ? "bg-danger_red/40 pointer-events-none"
                          : "bg-danger_red pointer-events-auto"
                      } text-white hover:bg-fire flex items-center gap-1`}
                      onClick={() => deleteFile(file.name, uploadid)}
                    >
                      {queuePoint.queue2 ? <SmallLoader /> : null}
                      Delete this file
                    </Button>
                  </div>
                </section>
              </main>
            )}
          </Fragment>
        )}
      </Suspense>
      <CommandBx open={open} setOpen={setOpen} />
      <Toaster />
    </>
  );
}

type HeaderProps = {
  DarkImage: StaticImageData;
  LightImage: StaticImageData;
  uploadid: string | string[] | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
  file: fileProp;
};

function Header({
  DarkImage,
  LightImage,
  uploadid,
  setOpen,
  file,
}: HeaderProps) {
  return (
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
          <Link href="/dashboard" className="font-medium">
            Dashboard
          </Link>{" "}
          /{" "}
          <Link href="/file" className="font-medium">
            File Router
          </Link>{" "}
          /{" "}
          <Link
            href={`/file/${uploadid}`}
            className="font-medium text-purplebtn underline"
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
          <Command className="md:w-6 lg:w-6 md:h-6 lg:h-5 w-4 h-5" />
        </Link>
        <Link
          href="https://post-io.gitbook.io/stashblob-docs/"
          target="_blank"
          className="dark:text-white text-blackmid transition-colors hover:text-elemgf hover:underline md:text-base lg:text-base text-sm font-medium"
        >
          Docs
        </Link>
        <UserButton />
      </nav>
    </header>
  );
}
