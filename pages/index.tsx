import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, ChangeEvent, Fragment } from "react";
import { UserButton } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommandBx } from "@/components/app/command-bx";

import { UploadCloud, Copy, X } from "lucide-react";
import UploadSection from "@/components/studio/uploadSection";

import Files from "@/components/studio/Files";

import axios from "axios";

type typeCounter = number;

type booleanType = boolean;

type typeUpldState = {
  isUploading: boolean;
  props: {
    uploading: string;
    upload: string;
  };
};

type supaType = {
  projectURL: string;
  public_anon_key: string;
};

type typeUser = string | null;

const supabaseProp: supaType = {
  projectURL: process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  public_anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
};

const supabase = createClient(
  supabaseProp.projectURL,
  supabaseProp.public_anon_key
);

export default function Home() {
  const { toast } = useToast();
  const { isLoaded, isSignedIn, user } = useUser();
  const [open, setOpen] = useState<booleanType>(false);
  const [show, setShow] = useState<booleanType>(false);
  const [files, setFiles] = useState([]);
  const [uploadState, setUploadState] = useState<typeUpldState>({
    isUploading: false,
    props: {
      uploading: "Uploading....",
      upload: "Upload",
    },
  });
  const [dataLoading, setDataLoading] = useState<booleanType>(false);
  const [userName, setuserName] = useState<typeUser>("");
  const [isErr, setIsErr] = useState<booleanType>(false);
  const [isProd, setIsProd] = useState<booleanType>(false);
  const [counter, setCounter] = useState<typeCounter>(0);

  useEffect(() => {
    setCounter((prev) => prev + 1);

    counter === 1 && fetchFiles();

    return () => {
      setCounter(0);
    };
  }, [counter, isSignedIn]);

  async function fetchFiles() {
    setIsErr(false);
    setDataLoading(true);
    if (isSignedIn) {
      const id = user.id;
      setuserName(user.fullName);
      axios
        .get(`http://localhost:8080/files/${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: process.env.NEXT_PUBLIC_API_KEY,
          },
        })
        .then(async function (response) {
          setFiles(response.data);
          setIsErr(false);
          setDataLoading(false);
        })
        .catch(async function (error) {
          console.error(error.response);
          setIsErr(true);
          setDataLoading(false);
          setFiles([]);
        });
    }
  }

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const filename = file?.name;
    const fileSize = file?.size;
    const fileType = file?.type;

    if (!file) {
      console.log("No file selected!");
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: false,
        };
      });
    } else {
      console.info("waiting...");
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: true,
        };
      });
      // 1. create draft billing record
      await createBillingDraft(file, filename, fileSize, fileType, event)
        .then(async function (data) {
          console.log("bill intiated");
        })
        .catch(async function (error) {
          console.error("bill error", error);
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: true,
            };
          });
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message,
          });
        });
    }
  };

  async function createBillingDraft(
    file: File,
    filename: string | undefined,
    fileSize: number | undefined,
    fileType: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (!isLoaded || !isSignedIn) {
      return null;
    } else {
      axios
        .post(
          "http://localhost:8080/initiate/billing",
          {
            userid: user.id,
            username: user.username,
          },
          {
            headers: {
              "Content-Type": "application/json",
              apikey: process.env.NEXT_PUBLIC_API_KEY,
            },
          }
        )
        .then(async function (response) {
          await intializeUpload(file, filename, fileSize, fileType, event)
            .then(async function (data) {
              console.info("upload intialized");
            })
            .catch(async function (error) {
              event.target.value = "";
              console.error("err from intializeUpload", error);
              toast({
                variant: "destructive",
                title: "Error",
                description: error.message,
              });
            });
          return "bill intiated";
          // console.log("response back", response.data);
        })
        .catch(async function (error) {
          console.error(error.response);
          throw new Error("failed to bill");
        });
    }
  }

  async function intializeUpload(
    file: File,
    filename: string | undefined,
    fileSize: number | undefined,
    fileType: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    const getFile = file;
    const { data, error } = await supabase.storage
      .from("shadow")
      .upload(`private/${filename}`, getFile, {
        cacheControl: "3600",
        upsert: true,
      });
    if (error) {
      setUploadState((prev) => {
        return {
          ...prev,
          isUploading: false,
        };
      });
      throw new Error(error.message);
    } else {
      await uploadFileDB(filename, fileSize, fileType, event)
        .then(async function (data) {
          console.info("uploading...");
        })
        .catch(async function (error) {
          console.error(error);
        });
    }
  }

  async function uploadFileDB(
    name: string | undefined,
    size: number | undefined,
    type: string | undefined,
    event: ChangeEvent<HTMLInputElement>
  ) {
    if (!isLoaded || !isSignedIn) {
      return null;
    } else {
      axios
        .post(
          "http://localhost:8080/upload",
          {
            filename: name,
            size: size,
            type: type,
            userid: user.id,
            username: user.username,
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
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: false,
            };
          });
          toast({
            title: "Success",
            description: response.data.message,
          });

          await fetchFiles();
          event.target.value = "";
          return response.data.message;
        })
        .catch(async function (error) {
          console.error(error.response);
          setUploadState((prev) => {
            return {
              ...prev,
              isUploading: false,
            };
          });
          toast({
            variant: "destructive",
            title: "Error",
            description: "err",
          });
          event.target.value = "";
          return error.response;
        });
    }
  }

  return (
    <>
      <Head>
        <title>stashblob/app</title>
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
        <meta property="og:title" content="stashblob/app" />
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
        <meta name="twitter:title" content="stashblob/app" />
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
      <div className="">
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
          <nav className="flex items-center md:gap-4 lg:gap-4 gap-1">
            {/* account */}
            <Input
              id="upload-file"
              name="mega"
              type="file"
              accept="image/png, image/jpg, image/jpeg, image/avif"
              className="hidden"
              onChange={uploadFile}
            />
            <Label
              htmlFor="upload-file"
              className={`${
                uploadState.isUploading
                  ? "bg-royalblue/30 p-2 px-4 pointer-events-none border border-blueborder rounded text-white flex items-center gap-1"
                  : "md:bg-royalblue lg:bg-royalblue bg-transparent md:transition-colors lg:transition-colors md:hover:bg-royalblue/60 lg:hover:bg-royalblue/60 p-2 px-4 cursor-pointer border md:border-blueborder/20 lg:border-blueborder/20 border-transparent rounded text-white flex items-center gap-1"
              }`}
            >
              <UploadCloud className="md:w-auto md:h-auto lg:w-auto lg:h-auto w-6 h-6" />{" "}
              <span className="md:block lg:block hidden">
                {uploadState.isUploading
                  ? uploadState.props.uploading
                  : uploadState.props.upload}
              </span>
            </Label>
            <Button
              className="bg-white hover:bg-midwhite text-darkestbg rounded md:flex lg:flex hidden items-center gap-1"
              onClick={() => setOpen(!open)}
            >
              Menu
            </Button>
            <UserButton />
          </nav>
        </header>
        <main>
          <div className="md:p-10 lg:p-10 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-20">
            <div className="flex flex-col gap-2">
              <h1 className="text-white md:text-3xl lg:text-3xl text-2xl font-normal">
                My Cloud
              </h1>
              <span className="text-hashtext md:text-base lg:text-base text-sm">
                Hello {userName ? userName : "Timi"}, Welcome Back!
              </span>
            </div>

            <div className="mt-8">
              <section>
                <article>
                  <h3 className="text-white md:text-2xl lg:text-2xl text-xl">
                    Recently shared
                  </h3>
                </article>
              </section>
              <UploadSection uploadFile={uploadFile} />

              <Files
                files={files}
                dataLoading={dataLoading}
                fetchFiles={fetchFiles}
                setShow={setShow}
              />
            </div>
            <Fragment>
              {files.length === 0 && isErr && (
                <div className="mt-8 flex items-center justify-center">
                  <div className="text-center flex-col">
                    <h2 className="text-2xl text-white">
                      No files uploaded yet
                    </h2>
                    <span className="text-sm text-white/30">
                      Upload some files to get started!
                    </span>
                  </div>
                </div>
              )}
            </Fragment>
          </div>
        </main>
        <CommandBx open={open} setOpen={setOpen} />
        <div
          className={
            show
              ? "fixed w-full h-full bg-darkmxbtn/50 backdrop-blur-md top-0 right-0 flex items-center justify-center min-h-screen transition-all opacity-1 pointer-events-auto"
              : "fixed w-full h-full bg-darkmxbtn/50 backdrop-blur-md top-0 right-0 flex items-center justify-center min-h-screen transition-all opacity-0 pointer-events-none"
          }
        >
          <div
            className={
              show
                ? "w-full max-w-md rounded-lg p-4 bg-[#101013] flex flex-col gap-5 transition-all scale-1 shadow-xl"
                : "w-full max-w-md rounded-lg p-4 bg-[#101013] flex flex-col gap-5 transition-all scale-0"
            }
          >
            <header className="flex items-center justify-between">
              <h4 className="text-white text-2xl">Share</h4>
              <X className="text-midwhite2 cursor-pointer" onClick={() => setShow(false)} />
            </header>
            <section className="flex flex-col gap-2">
              <span className="text-hashtext">Invite</span>
              <div className="flex items-center gap-3">
                <Input
                  type="email"
                  placeholder="Type emails here..."
                  className="border border-darkbtn/30 bg-thirdprop focus:bg-darkmxbtn text-hashtext"
                  disabled
                />
                <Button
                  className="bg-royalblue hover:bg-royalglue px-7 text-white"
                  disabled
                >
                  Share
                </Button>
              </div>
            </section>
            <section className="mt-8 flex flex-col gap-2">
              <span className="text-hashtext">Get Link</span>
              <div className="">
                <Button
                  variant="link"
                  className="flex items-center gap-2 text-fileicon"
                  onClick={() => confirm("This feature is experimental")}
                >
                  <Copy className="w-6 h-6" /> Copy link
                </Button>
              </div>
            </section>
          </div>
        </div>
        <footer className="fixed bottom-0 md:hidden lg:hidden block w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 bg-darkestbg/70 backdrop-blur-md border border-transparent border-b-borderbtm">
          <div className="flex items-center justify-between px-2">
            <Button
              className="bg-darkbtn hover:bg-darkbtnhover text-white rounded"
              onClick={() => setOpen(!open)}
            >
              Menu
            </Button>
          </div>
        </footer>
      </div>
      <Toaster />
    </>
  );
}
