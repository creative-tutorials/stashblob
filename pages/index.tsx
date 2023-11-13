import Head from "next/head";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect, ChangeEvent, Fragment } from "react";
import { useUser } from "@clerk/nextjs";

import { CommandBx } from "@/components/app/command-bx";
import Header from "@/components/app/Header";
import ModalUI from "@/components/app/modalUI";

import { PackageOpen } from "lucide-react";

import UploadSection from "@/components/studio/uploadSection";
import Files from "@/components/studio/Files";

import { extension } from "@/types/appx";
import { supaType } from "@/types/appx";
import { typeUpldState } from "../types/appx";
import { typeCounter } from "@/types/appx";
import { booleanType } from "@/types/appx";
import { typeUser } from "@/types/appx";

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
  const [extension, setExtension] = useState<extension>({
    filename: "",
    uploadID: "",
  });
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
        .get(`https://s-blob.vercel.app/files/${id}`, {
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
      toast({
        description: "Uploading...",
      });
      // 1. create draft billing record
      await createBillingDraft(file, filename, fileSize, fileType, event)
        .then(async function (data) {
          console.log("bill intiated");
          toast({
            description: "Uploading...",
          });
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
          "https://s-blob.vercel.app/initiate/billing",
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
              toast({
                description: "Uploading...",
              });
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
          toast({
            description: "Uploading...",
          });
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
          "https://s-blob.vercel.app/upload",
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
        <Header
          uploadFile={uploadFile}
          setOpen={setOpen}
          open={open}
          uploadState={uploadState}
        />
        <main>
          <div className="md:p-10 lg:p-10 md:px-14 lg:px-14 p-4 md:mt-14 lg:mt-14 mt-20">
            <div className="flex flex-col gap-2">
              <h1 className="dark:text-white text-black md:text-3xl lg:text-3xl text-2xl font-normal">
                My Cloud
              </h1>
              <span className="dark:text-hashtext text-darkbtn md:text-base lg:text-base text-sm">
                Hello {userName ? userName : "Timi"}, Welcome Back!
              </span>
            </div>

            <div className="mt-8">
              <section>
                <article className="flex flex-col gap-2">
                  <h3 className="dark:text-white text-blackmid md:text-2xl lg:text-2xl text-xl">
                    Folders
                  </h3>
                  <span className="dark:bg-darkbtn bg-hashtext text-darkmxbtn dark:text-white p-1 w-28 rounded-md">
                    Not available!
                  </span>
                </article>
              </section>
              <UploadSection uploadFile={uploadFile} />

              <Files
                files={files}
                dataLoading={dataLoading}
                isErr={isErr}
                fetchFiles={fetchFiles}
                setShow={setShow}
                setExtension={setExtension}
              />
            </div>
            <Fragment>
              {files.length === 0 && isErr && (
                <div className="mt-8 flex flex-col items-center justify-center">
                  <div>
                    <PackageOpen className="w-20 h-20 text-whiteos" />
                  </div>
                  <hgroup className="text-center flex-col">
                    <h2 className="text-2xl text-white">
                      No files uploaded yet
                    </h2>
                    <span className="text-sm text-white/30">
                      Upload some files to get started!
                    </span>
                  </hgroup>
                </div>
              )}
            </Fragment>
          </div>
        </main>
        <CommandBx open={open} setOpen={setOpen} />
        <ModalUI show={show} setShow={setShow} extension={extension} />
        {/* <footer className="fixed bottom-0 md:hidden lg:hidden block w-full z-10 md:p-3 md:px-10 lg:p-3 lg:px-10 p-4 dark:bg-darkestbg/70 bg-white/30 backdrop-blur-md border border-transparent border-b-borderbtm">
          <div className="flex items-center justify-between px-2">
            <Button
              className="dark:bg-darkbtn bg-darkestbg hover:bg-darkmxbtn hover:dark:bg-darkbtnhover dark:text-white text-white rounded"
              onClick={() => setOpen(!open)}
            >
              Menu
            </Button>
          </div>
        </footer> */}
      </div>
      <Toaster />
    </>
  );
}


